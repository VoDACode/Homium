# Frontend Documentation

The frontend is built using [React](https://reactjs.org/).

> # Navigation
>
> * [Routes](#routes)
> * [Pages](#pages)
>   * [Home](#home)
>   * [Admin Dashboard](#admin-dashboard)
>   * [Objects](#objects)
>   * [Login](#login)
> * [Components](#components)
>   * [Admin Navigation](#admin-navigation)
>   * [Navigation panel details](#navigation-panel-details)

## Routes

```
/ - Home
/admin - Admin Dashboard
/admin/objects - The list of objects
/admin/objects/:id - The details of an object and its edit form
/admin/objects/:id/:property - Object property details and property edit form [IDEA: maybe this should be a modal instead of a separate page?]
/admin/objects/new - The form to create a new object
/reg - Registration form
/auth - Login form
```

# Pages

## Home

The home page is a page that displays the list of scenes and selected scene. It also has a button to create a new scene and edit the selected scene.

Something like that:
![Home Page](/docs/imgs/home-page.png)

## Admin Dashboard

The admin dashboard is a page that displays the system statistics, like: IO read/write, CPU usage, memory usage, etc.
And also administrator can use this page for navigating to other admin pages.

Something like that:
![Admin Dashboаrd](/docs/imgs/admin-dashboard.png)

More details about the navigation panel can be found in the [Admin Navigation](#admin-navigation) section.

All pages in `/admin/*` should displayed [navigation panel](#admin-navigation).

## Objects

The objects page is a page that displays the list of objects and the details of an object.

Of course, the navigation bar is displayed.

This page has the following structure:
```
├── [Object Name]
│    ├── Properties
│    │    ├── [Property Name and Value]
│    │    └── Other Properties...
│    └── Children
│         ├── [Child Name. Next, everything is in a recursive form]
│         └── Other Children...
└── Other Objects...
```

## Login

The login page is a page that displays the login form.

If the client is not authorized, it redirects to this page.

# Components

## Admin Navigation

The navigation panel has the following structure:
```
├── Home page (Route: /)
├── System info (Route: /admin)
├── Objects
│    ├── List (Route: /admin/objects)
│    ├── Devices (Route: /admin/devices)
│    │   ├── [Device Name] (Route: /admin/devices/:id)
│    │   └── Other Devices...
│    └── Rooms (Route: /admin/rooms)
├── Automation
│    ├── Schedules (Route: /admin/schedules)
│    ├── Scripts (Route: /admin/scripts)
│    └── Triggers (Route: /admin/triggers)
├── Extensions
│    ├── Repositories (Route: /admin/repositories)
│    └── Installed (Route: /admin/extensions)
│       ├── [Extension Name] (Route: /admin/extensions/:id)
│       └── Other Extensions...
├── Users (Route: /admin/users)
├── System
│     ├── API (Route: /admin/system/api)
│     ├── Logs (Route: /admin/system/logs)
│     ├── Statistics (Route: /admin/system/statistics)
│     └── Settings (Route: /admin/system/settings)
└── Logout (Action: logout)
```

### Navigation panel details

>#### Home page
>
>A link to the home page.

>#### System info
>
>A link to the admin dashboard.

>#### Objects
>
>>#### List
>>
>>A link to the objects list page.
>
>>#### Devices
>>
>>A link to the devices list page.
>>
>>>#### [Device Name]
>>>
>>>A link to the device details page.
>
>>#### Rooms
>>
>>A link to the rooms list page.

>#### Automation
>
>>#### Schedules
>>
>>A link to the schedules list page.
>
>>#### Scripts
>>
>>A link to the scripts list page.
>
>>#### Triggers
>>
>>A link to the triggers list page.

>#### Extensions
>
>>#### Repositories
>>
>>A link to the repositories list page.
>
>>#### Installed
>>
>>A link to the installed extensions list page.
>>
>>>#### [Extension Name]
>>>
>>>A link to the extension page.

>#### Users
>
>A link to the users list page.

>#### System
>
>>#### API
>>
>>A link to the API keys list page.
>
>>#### Logs
>>
>>A link to the logs page.
>
>>#### Statistics
>>
>>A link to the statistics page.
>
>>#### Settings
>>
>>A link to the system settings page.

>#### Logout
>
>Logout action.