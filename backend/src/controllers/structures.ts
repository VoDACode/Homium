import express from 'express';
import { authGuard, hasPermission } from '../guards/AuthGuard';
import { DeviceModel, DeviceProperty } from '../models/DeviceModel';
import { SectionModel } from '../models/SectionModel';
import { SectorModel } from '../models/SectorModel';
import ObjectService from '../services/ObjectService';
import SectorService from '../services/SectorService';

const router = express.Router();

/*
    Sectors -> Sections -> Devices -> Properties
*/

// get all sectors
router.get('/', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.read) !== true) {
        res.status(403).send('Permission denied');
        return;
    }
    res.send(SectorService.sector.list().map(s => {
        return {
            name: s.name,
            description: s.description,
            aliases: s.aliases,
            sectorType: s.sectorType,
            isDefault: s.isDefault,
        }
    }));
});

// get all sections in a sector
router.get('/:sectorName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.read) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    try {
        const sections = SectorService.sections.list(req.params.sectorName);
        res.send(sections.map(s => {
            return {
                name: s.name,
                description: s.description,
                aliases: s.aliases
            }
        }));
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// get all devices in a section
router.get('/:sectorName/:sectionName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.read) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    try {
        const devices = SectorService.devices.list(req.params.sectorName, req.params.sectionName);
        res.send(await devices.map(async d => {
            return {
                name: d.name,
                description: d.description,
                aliases: d.aliases,
                type: d.type,
                properties: await d.properties.map(async p => {
                    return {
                        name: p.name,
                        description: p.description,
                        aliases: p.aliases,
                        objectId: p.objectId,
                        objectProperty: p.objectProperty,
                        value: (await ObjectService.get(p.objectId))?.properties.find(op => op.key === p.objectProperty)?.value
                    }
                })
            }
        }));
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// create a sector
router.post('/', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.create) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const name: string = req.body.name;
    const description: string = req.body.description || '';
    const aliases: string[] = req.body.aliases || [];
    const sectorType: string = req.body.sectorType || 'house';
    const isDefault: boolean = req.body.isDefault || false;

    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid name');
        return;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send('Invalid description');
        return;
    }

    if (aliases !== undefined && !Array.isArray(aliases)) {
        res.status(400).send('Invalid aliases');
        return;
    }

    if (sectorType === undefined || typeof sectorType !== 'string') {
        res.status(400).send('Invalid sectorType');
        return;
    }

    let sector = new SectorModel(name, description, sectorType, []);
    sector.aliases = aliases;
    sector.isDefault = isDefault;

    try {
        await SectorService.sector.add(sector);
        res.status(201).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// create a section
router.post('/:sectorName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.create) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const name: string = req.body.name;
    const description: string = req.body.description || '';
    const aliases: string[] = req.body.aliases || [];

    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid name');
        return;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send('Invalid description');
        return;
    }

    if (aliases !== undefined && !Array.isArray(aliases)) {
        res.status(400).send('Invalid aliases');
        return;
    }

    let section = new SectionModel(name, description);

    try {
        await SectorService.sections.add(req.params.sectorName, section);
        res.status(201).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// create a device
router.post('/:sectorName/:sectionName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.create) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const name: string = req.body.name;
    const description: string = req.body.description || '';
    const aliases: string[] = req.body.aliases || [];
    const type: string = req.body.type;
    const properties: DeviceProperty[] = req.body.properties;

    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid name');
        return;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send('Invalid description');
        return;
    }

    if (aliases !== undefined && !Array.isArray(aliases)) {
        res.status(400).send('Invalid aliases');
        return;
    }

    if (type === undefined || typeof type !== 'string') {
        res.status(400).send('Invalid type');
        return;
    }

    if (properties === undefined || !Array.isArray(properties)) {
        res.status(400).send('Invalid properties');
        return;
    }

    for (let i = 0; i < properties.length; i++) {
        const p = properties[i];
        if (p.name === undefined || typeof p.name !== 'string') {
            res.status(400).send('Invalid property name');
            return;
        }

        if (p.description !== undefined && typeof p.description !== 'string') {
            res.status(400).send('Invalid property description');
            return;
        }

        if (p.aliases !== undefined && !Array.isArray(p.aliases)) {
            res.status(400).send('Invalid property aliases');
            return;
        }

        if (p.objectId === undefined || typeof p.objectId !== 'string') {
            res.status(400).send('Invalid property objectId');
            return;
        }
        let object = await ObjectService.get(p.objectId);
        if (object === undefined) {
            res.status(400).send('Invalid property objectId. Object not found');
            return;
        }

        if (p.objectProperty === undefined || typeof p.objectProperty !== 'string') {
            res.status(400).send('Invalid property objectProperty');
            return;
        } else if (object.properties.findIndex(op => op.key === p.objectProperty) === -1) {
            res.status(400).send('Invalid property objectProperty. Property not found');
            return;
        }
    }

    let device = new DeviceModel(name, description || "", type);
    device.aliases = aliases || [];
    device.properties = (properties as DeviceProperty[]).map(p => {
        return {
            name: p.name,
            description: p.description,
            aliases: p.aliases,
            objectId: p.objectId,
            objectProperty: p.objectProperty
        }
    });

    try {
        await SectorService.devices.add(req.params.sectorName, req.params.sectionName, device);
        res.status(201).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// set a device property
router.post('/:sectorName/:sectionName/:deviceName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.canUse) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const prop = req.body.property;
    const value: any = req.body.value;

    if (value === undefined) {
        res.status(400).send('Invalid value');
        return;
    }

    try {
        SectorService.devices.setProperty(req.params.sectorName, req.params.sectionName, req.params.deviceName, prop, value);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// delete a sector
router.delete('/', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.remove) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const target = req.query.target;

    if (target === undefined || target === '' || typeof target !== 'string') {
        res.status(400).send('Invalid target');
        return;
    }

    try {
        await SectorService.sector.remove(target);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// delete a section
router.delete('/:sectorName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.remove) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const target = req.query.target;

    if (target === undefined || target === '' || typeof target !== 'string') {
        res.status(400).send('Invalid target');
        return;
    }

    try {
        await SectorService.sections.remove(req.params.sectorName, target);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// delete a device
router.delete('/:sectorName/:sectionName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.remove) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const target = req.query.target;

    if (target === undefined || target === '' || typeof target !== 'string') {
        res.status(400).send('Invalid target');
        return;
    }

    try {
        await SectorService.devices.remove(req.params.sectorName, req.params.sectionName, target);
        res.status(200).send();
    } catch (e) {
        res.status(400).send(e);
    }
});

// update a sector
router.put('/', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.update) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const target = req.query.target;
    const name: string = req.body.name;
    const description: string = req.body.description || '';
    const aliases: string[] = req.body.aliases || [];
    const sectorType: string = req.body.sectorType;

    if(target === undefined || target === '' || typeof target !== 'string') {
        res.status(400).send('Invalid target');
        return;
    }

    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid name');
        return;
    }

    try {
        var sector = await SectorService.sector.get(target);
    } catch (e) {
        res.status(400).send(e);
        return;
    }

    if (sector.name !== name && SectorService.sector.get(name) !== undefined) {
        res.status(400).send('Sector with this name already exists');
        return;
    } else {
        sector.name = name;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send('Invalid description');
        return;
    } else {
        sector.description = description;
    }

    if (aliases !== undefined && !Array.isArray(aliases)) {
        res.status(400).send('Invalid aliases');
        return;
    } else {
        sector.aliases = aliases;
    }

    if (sectorType !== undefined && typeof sectorType !== 'string') {
        res.status(400).send('Invalid sectorType');
        return;
    } else {
        sector.sectorType = sectorType;
    }

    try {
        await SectorService.sector.update(target, sector);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});

// update a section
router.put('/:sectorName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.update) !== true) {
        res.status(403).send('Permission denied');
        return;
    }
    const target = req.query.target;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const aliases: string[] = req.body.aliases;

    if(target === undefined || target === '' || typeof target !== 'string') {
        res.status(400).send('Invalid target');
        return;
    }

    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid name');
        return;
    }

    try {
        var section = await SectorService.sections.get(req.params.sectorName, target);
    } catch (e) {
        res.status(400).send(e);
        return;
    }

    if (section.name !== name && SectorService.sections.get(req.params.sectorName, name) !== undefined) {
        res.status(400).send('Section with this name already exists');
        return;
    } else {
        section.name = name;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send('Invalid description');
        return;
    } else {
        section.description = description;
    }

    if (aliases !== undefined && !Array.isArray(aliases)) {
        res.status(400).send('Invalid aliases');
        return;
    } else {
        section.aliases = aliases;
    }

    try {
        await SectorService.sections.update(req.params.sectorName, target, section);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }

});

// update a device
router.put('/:sectorName/:sectionName', authGuard, async (req, res) => {
    if (await hasPermission(req, p => p.devices.update) !== true) {
        res.status(403).send('Permission denied');
        return;
    }

    const target = req.query.target;
    const name: string = req.body.name;
    const description: string = req.body.description;
    const aliases: string[] = req.body.aliases;
    const deviceType: string = req.body.type;
    const properties: DeviceProperty[] = req.body.properties;

    if(target === undefined || target === '' || typeof target !== 'string') {
        res.status(400).send('Invalid target');
        return;
    }

    if (name === undefined || name === '' || typeof name !== 'string') {
        res.status(400).send('Invalid name');
        return;
    }

    try {
        var device = await SectorService.devices.get(req.params.sectorName, req.params.sectionName, target);
    } catch (e) {
        res.status(400).send(e);
        return;
    }

    if (device.name !== name && SectorService.devices.get(req.params.sectorName, req.params.sectionName, name) !== undefined) {
        res.status(400).send('Device with this name already exists');
        return;
    } else {
        device.name = name;
    }

    if (description !== undefined && typeof description !== 'string') {
        res.status(400).send('Invalid description');
        return;
    } else {
        device.description = description;
    }

    if (aliases !== undefined && !Array.isArray(aliases)) {
        res.status(400).send('Invalid aliases');
        return;
    } else {
        device.aliases = aliases;
    }

    if (deviceType !== undefined && typeof deviceType !== 'string') {
        res.status(400).send('Invalid deviceType');
        return;
    } else {
        device.type = deviceType;
    }

    if (properties !== undefined && !Array.isArray(properties)) {
        res.status(400).send('Invalid properties');
        return;
    }

    for (let i = 0; i < properties.length; i++) {
        if (properties[i].name === undefined || properties[i].name === '' || typeof properties[i].name !== 'string') {
            res.status(400).send('Invalid property name');
            return;
        }

        var object = await ObjectService.get(properties[i].name);

        if (properties[i].objectId === undefined || properties[i].objectId === '' || typeof properties[i].objectId !== 'string') {
            res.status(400).send('Invalid property objectId ' + properties[i].objectId);
            return;
        }

        if (object === undefined) {
            res.status(400).send('Invalid property objectId ' + properties[i].objectId + ' (object not found)');
            return;
        }

        if (properties[i].objectProperty === undefined || properties[i].objectProperty === '' || typeof properties[i].objectProperty !== 'string') {
            res.status(400).send('Invalid property objectProperty ' + properties[i].objectProperty);
            return;
        }

        if (object.properties.findIndex(p => p.key === properties[i].objectProperty) === -1) {
            res.status(400).send('Invalid property objectProperty ' + properties[i].objectProperty + ' (property not found)');
            return;
        }

        properties[i].description = properties[i].description || '';
        properties[i].aliases = properties[i].aliases || [];
    }

    try {
        if (properties !== undefined) {
            device.properties = properties;
        }
        await SectorService.devices.update(req.params.sectorName, req.params.sectionName, target, device);
        res.status(200).send();
    }
    catch (e) {
        res.status(400).send(e);
    }
});



module.exports = router;