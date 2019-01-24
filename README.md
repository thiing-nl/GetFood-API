# GetFood API

Make sure you have [MongoDB](https://docs.mongodb.com/manual/installation/#tutorials) installed.

You can modify the MONGOOSE_URL in the .env file (if it doens't exist create it by copying .env.example)

## Continous Integration

Every commit **against master** will be tested / compiled in CircleCi, and once completed/succesful will be deployed to our server [api-v2.getfood.io](api-v2.getfood.io)


## Methods

| Method 	| Endpoint                           	| Class method                         	|
|--------	|------------------------------------	|--------------------------------------	|
| POST   	| /v2/family/                        	| FamilyController.create()            	|
| GET    	| /v2/family/                        	| FamilyController.getActiveFamily()   	|
| PUT    	| /v2/family/                        	| FamilyController.update()            	|
| DELETE 	| /v2/family/                        	| FamilyController.leaveActiveFamily() 	|
| POST   	| /v2/family/:familyId/join          	| FamilyController.joinFamily()        	|
| POST   	| /v2/list/:listId/items/            	| ListItemController.create()          	|
| PUT    	| /v2/list/:listId/items/:listItemId 	| ListItemController.update()          	|
| DELETE 	| /v2/list/:listId/items/:listItemId 	| ListItemController.delete()          	|
| POST   	| /v2/list/                          	| ListController.create()              	|
| GET    	| /v2/list/                          	| ListController.getLists()            	|
| GET    	| /v2/list/colors                    	| ListController.getColors()           	|
| GET    	| /v2/list/:listId                   	| ListController.get()                 	|
| PUT    	| /v2/list/:listId                   	| ListController.update()              	|
| DELETE 	| /v2/list/:listId                   	| ListController.delete()              	|
| POST   	| /v2/user/                          	| UserController.register()            	|
| POST   	| /v2/user/auth                      	| UserController.authenticate()        	|
| GET    	| /v2/user/                          	| UserController.currentUser()         	|
| PUT    	| /v2/user/                          	| UserController.update()              	|
| DELETE 	| /v2/user/                          	| UserController.delete()              	|
| GET    	| /                                  	| VersionController.getRoutes()        	|
