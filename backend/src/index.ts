import { serviceManager, IConfigService, IDatabaseService, IExtensionsService, ILogService, ILogger, IMqttService, IObjectService, IScriptService, ISectorService, ISystemService } from "homium-lib/services";
import { ConfigService, DatabaseService, ExtensionsService, LogService, Logger, MqttService, ObjectService, ScriptService, SectorService, SystemService } from "./services";

serviceManager.singleton(ISystemService, SystemService);

serviceManager.singleton(IConfigService, ConfigService);

serviceManager.singleton(ILogService, LogService);
serviceManager.factory(ILogger, Logger);

serviceManager.singleton(IDatabaseService, DatabaseService);
serviceManager.singleton(IMqttService, MqttService);

serviceManager.singleton(IExtensionsService, ExtensionsService);
serviceManager.singleton(IObjectService, ObjectService);
serviceManager.singleton(IScriptService, ScriptService);
serviceManager.singleton(ISectorService, SectorService);

let system = serviceManager.get(ISystemService);
system.start();
    