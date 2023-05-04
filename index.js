import  express  from "express";
import  {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import cors from 'cors'
import { create, assignstudent, assignmentor } from "./mongo_query.js";
dotenv.config()
const app=express()
const PORT=process.env.PORT;
app.use(cors())
app.use(express.json())  //interceptor convert body to json

const MONGO_URL=process.env.MONGO_URL;
async function createConnection(){
    const data=new MongoClient(MONGO_URL);
    await data.connect();
    return data;
}
export const client= await createConnection();

//1,2 create a mentor and student
app.post('/create',async(req,res)=>{
    const type=req.query.type;
    const insidebody=req.body;
    const product=await create(type, insidebody)
    return res.send(product)
})
//3 select one mentor and assign a multi-student
app.put('/mentor/:id',async(req,res)=>{
    try{
        let select_Stud = await assignstudent()
        const pick=Number(req.params['id'])
        const product=await client.db("school").collection("Mentor").updateOne({id:{$eq:pick}},{$set:{student_list: select_Stud }}).toArray()
        return res.send(product)
    }
    catch{
        return res.send("No student assign")
    }
 })
//4 Assign or Change Mentor for particular Student
app.put('/student/:id',async(req,res)=>{
    try{
        const pick=Number(req.params['id'])
        let select_men = [...select_men,await assignmentor()]
        console.log(select_men)
        const product=await client.db("school").collection("Student").updateOne({id:{$eq:pick}},{$set:{mentor: select_men}}).toArray()
        return res.send(product)
    }
    catch{
        return res.send("No Mentor assign")
    }
})

//5  show all students for a particular mento
app.get('/showmentor/:id',async(req,res)=>{
    try{
        const pick=Number(req.params['id'])
        const product=await client.db("school").collection("Mentor").find({id:{$eq:pick}},{_id:0}).toArray()
        return res.send(product)
    }
    catch(err){
        return res.send({message:err.message})
    }
})

//6 API to show the previously assigned mentor for a particular student.
app.get('/student/:id',async(req,res)=>{
    try{
        const pick=Number(req.params['id'])
        const product=await client.db("school").collection("Student").find({id:{$eq:pick}},{_id:0,mentor:1 ,student_name:1}).toArray()
        return res.send(product)
    }
    catch(err){
        return res.send({message:err.message})
    }
})


app.get('/student',async(req,res)=>{
    try{
        const product=await client.db("school").collection("Student").find({}).toArray()
        return res.send(product)
    }
    catch(err){
        return res.send({message:err.message})
    }
})

app.get('/mentor',async(req,res)=>{
    try{
        const product=await client.db("school").collection("Mentor").find({}).toArray()
        return res.send(product)
    }
    catch(err){
        return res.send({message:err.message})
    }
})

app.get('/studentwithoutmentor',async(req,res)=>{
    try{
        const product=await assignstudent();
        return res.send(product)
    }
    catch(err){
        return res.send({message:err.message})
    }
})




app.listen(PORT,()=>console.log("server started on port",PORT))


