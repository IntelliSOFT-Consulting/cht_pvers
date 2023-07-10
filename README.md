# CHT Pharmacovigilance Module

This is a Pharmacovigilance module for the Community Health Toolkit powered by medic



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