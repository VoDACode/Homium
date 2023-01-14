# Get started with the project

## Navigations

* [Clone the repository](#clone-the-repository)
* Installation of dependencies for:
  * [Linux](#linux)
  * [Windows](#windows)

## Inicialization

### Clone the repository

First of all, you need to clone the repository:

```bash
git clone https://github.com/VoDACode/Homium
```

## Linux

Then you need to install project dependencies:

```bash
sudo bash ./init.sh
```

This script will install all dependencies and will create a virtual environment for the project.

## Windows

You need to install [Node.js](https://nodejs.org/). Then you need to install project dependencies. Run `init.bat` file for installing dependencies.

## Run

To run the project, you need to run `npm run start` command in the root directory of the project. After that, you can open the project in your browser by the address `http://localhost:4200`.

After that you have access to api by the address `http://localhost:3000` and to frontend by the address `http://localhost:4200`.

You can configure proxy in `proxy.conf.json` file on the `ClientApp` folder.
