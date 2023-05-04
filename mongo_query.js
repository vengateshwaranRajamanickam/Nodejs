import { client } from "./index.js";

export async function create(type,insidebody) {
    return await client.db("school").collection(`${type}`).insertMany(insidebody);
}
export async function assignstudent() {
    return await client.db("school").collection("Student").find({ mentor:""}, { _id: 0, student_name: 1 }).toArray();
}
export async function assignmentor() {
    return await client.db("school").collection("Mentor").find({ student_list:""}, { _id: 0, mentor_name: 1 }).sort(1).limit(1).toArray();
}
