# CHT Pharmacovigilance Module

This is a Pharmacovigilance module for the Community Health Toolkit powered by medic

# Prerequisite
Before you begin, ensure you have the following tools:

```
git or the Github Desktop
docker and docker-compose.
```
# Developing locally 
To build CHT apps on your local system, you need to have some additional tools:

```
sudo apt update && sudo apt -y dist-upgrade
sudo apt -y install python3-pip python3-setuptools python3-wheel xsltproc
# Use NVM to install NodeJS:
export nvm_version=`curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | jq -r .name`
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/$nvm_version/install.sh | $SHELL
. ~/.$(basename $SHELL)rc
nvm install 20

```
## pyxform 
Using python on your terminal, install pyxform globally using the command below.

```
sudo python -m pip install git+https://github.com/medic/pyxform.git@medic-conf-1.17#egg=pyxform-medic

```
## cht-conf

Using npm on your terminal, install cht-conf globally using the command below.

```
npm install -g cht-conf
```


# HIE

Additionally is a Health Information Exchange powered by OpenHIM, is also available. 
This is to facilitate data exchange and interoperability between the PVERs CHT module and the main PVERs system.


Using the quick setup `./setup.sh` script.

```
  up            starts the docker containers in production mode
  dev           starts the docker containers in development mode
  publish       packages and publish the CHT app to the CHT Instance.
  down          stop all services
  setup-creds   create OpenHIM credentials on CHT Instance.
  logs          view mediator logs (append service name to specify service)
  
```