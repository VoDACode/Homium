# Homium

## Description

Homium is a smart home system. It is a web application that allows you to control your smart home devices from anywhere in the world. It is also a platform for creating custom scripts for automatization.

## Features

* Web interface
* Objected system of smart home devices
* Custom scripts for automatization
* Support for custom extensions
* Swagger API documentation

## Installation

For installation you need to have "empty" [Ubuntu 20.04](https://releases.ubuntu.com/focal/ubuntu-20.04.6-live-server-amd64.iso) server.

You can install Homium using install script:

```bash
curl -s https://raw.githubusercontent.com/VoDACode/Homium/master/install.sh | sudo bash
```

This script will install all dependencies and Homium itself.

After installation web-server will be available on port `80`, and API on port `8080`.

## Usage

After installation you can open Homium in your browser by server IP address.

Default login and password is `root` and `toor`. You can change it user settings.

## [For developers](docs/for-developers.md)
