# Change these values to the ones used to create the App Service.
RESOURCE_GROUP_NAME='podcastpulse_group-8341'
APP_SERVICE_NAME='podcastpulse'

az webapp deploy \
    --name $APP_SERVICE_NAME \
    --resource-group $RESOURCE_GROUP_NAME \
    --src-path web.zip
