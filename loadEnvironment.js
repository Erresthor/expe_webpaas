let we_are_live = (process.env.NODE_ENV=="production")||(process.env.NODE_ENV=="pre-production")

if (!we_are_live) { // Local build, read from the .env file !
    console.log("Not in production mode: loading local environment");
    require('dotenv').config();
    process.env.ATLAS_URI = process.env.ATLAS_URI_TEST;
}