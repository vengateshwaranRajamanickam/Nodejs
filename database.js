import  {MongoClient} from "mongodb";
import  ObjectID from "mongodb";
const MONGO_URL='mongodb://0.0.0.0:27017';
let database;

async function Database(){ 
    const data = await new MongoClient.connect(MONGO_URL);
    database = data.db("Hotel");
    if (!database) {
            console.log('Database not connected');
    }

    return database;
}

export{Database,ObjectID}