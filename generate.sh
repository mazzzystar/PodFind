RESOURCE_GROUP_NAME='podcastpulse_group-8341'
APP_SERVICE_NAME='podcastpulse'

az webapp config appsettings set \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $APP_SERVICE_NAME \
    --settings SCM_DO_BUILD_DURING_DEPLOYMENT=true
