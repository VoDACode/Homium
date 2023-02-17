@echo off

set VM_NAME=homium_dev_vm
set MEMORY=2GB

docker build -t %VM_NAME% -m %MEMORY% -f ./create-vm.dockerfile .

docker run -d -it --rm --name %VM_NAME% -p 3000:3000 %VM_NAME%