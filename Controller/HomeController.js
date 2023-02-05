const {MongoClient, ObjectId} = require('mongodb');
const url = require('url');
const queryString = require('querystring');
const connection_string = "mongodb+srv://rakib:rakib@cluster0.w8xy4.mongodb.net/test";
const client = new MongoClient(connection_string);
const db_name = "crud";


const HomePage = async (req, res) => {
    let page = 1;
    let request = req.query;

    if(request.page > 0){
        page = request.page;
    }

    try{
        await client.connect();
        let database = await client.db(db_name);
        let collection = await database.collection('users');

        let findAll = await collection.find({});
        let totalRow = await findAll.count();
        let previousPage = null;
        let nextPage = null;
        let links = [];

        let showPerPage = 7;
        (request.show == undefined || request.show == "undefined") ? showPerPage = 7 : showPerPage = request.show;

        let numberOfPage = Math.ceil(totalRow / showPerPage);
        for(let pageNo = 1 ; pageNo <= numberOfPage; pageNo++ ){
            if(pageNo == page){
                previousPage = ( Number(page) > 1) ? '/?page='+(Number(pageNo)-1)+"&show="+showPerPage : null
                nextPage =  (Number(page) < numberOfPage)  ? '/?page='+(Number(pageNo)+1)+"&show="+showPerPage : null
            }
            links.push({
                pageNo: pageNo,
                link: '/?page='+pageNo+"&show="+showPerPage,
                active: (pageNo == page) ? true : false
            })
        }


        let currentPage = page - 1;
        let skip = currentPage * Number(showPerPage);
        let data = findAll.limit(Number(showPerPage)).skip(skip);
        let arr = [];
        await data.forEach((item) => {
            arr.push(item)
        })

        let viewData = {
            data: arr,
            links : links,
            previousPage: previousPage,
            nextPage: nextPage,
            showPerPage: showPerPage
        }

        // res.send(viewData);

        res.render('index.ejs', viewData)

    }
    finally {
        await client.close();
    }

}
const AddPage = (req, res) => {

    res.render('add.ejs', req.query);
}
const Add = async (req, res) => {
    let request = req.body;
    await client.connect();
    let database = await client.db(db_name);
    let collection = await database.collection('users');
    let validateArr = [
        {name: "First Name", required: true, value: request.fname},
        {name: "Last Name", required: true, value: request.lname},
        {name: "Email", required: true, value: request.email},
    ]

    let data = null;
    let validate = validateInput(validateArr);
    if(validate.status == true){
        data =   {
            fname: request.fname,
            lname: request.lname,
            email: request.email,
            image: ''
        }

    }
    else{
        return res.redirect('/add?'+queryString.stringify(validate));
    }


    let result = await collection.insertOne(data);

    if(result.acknowledged == true){
        let withData = queryString.stringify({
            status: true,
            message: "inserted successfully"
        });
        return res.redirect('/add?'+withData);
    }
    else{
        let withData = queryString.stringify({
            status: false,
            message: 'something went wrong. try again'
        });
        return res.redirect(200, '/add?'+withData);
    }
}

const View = async (req, res) => {
    await client.connect();
    let database = await client.db(db_name);
    let collection = await database.collection('users');
    let data = {
        _id: new ObjectId(req.params.id)
    }

    let result = await collection.findOne(data);

    res.render('view.ejs', result);
}

const EditPage = async (req, res) => {
    await client.connect();
    let database = await client.db(db_name);
    let collection = await database.collection('users');
    let data = {
        _id: new ObjectId(req.params.id)
    }

    let result = await collection.findOne(data);

    let new_res = {...result, ...req.query };

    res.render('edit.ejs', new_res);
}

const Edit = async function(req, res){
    let request = req.body;
    await client.connect();
    let database = await client.db(db_name);
    let collection = await database.collection('users');
    let validateArr = [
        {name: "First Name", required: true, value: request.fname},
        {name: "Last Name", required: true, value: request.lname},
        {name: "Email", required: true, value: request.email},
    ]

    let data = null;
    let user_id = new ObjectId(request._id);
    let filterCriteria = {_id : user_id}
    let validate = validateInput(validateArr);
    if(validate.status == true){
        data =   {
            fname: request.fname,
            lname: request.lname,
            email: request.email,
            image: ''
        }

    }
    else{
        return res.redirect(`/edit/${user_id}?${queryString.stringify(validate)}`);
    }


    let result = await collection.updateOne(filterCriteria,{$set: data});

    if(result.acknowledged == true){
        let withData = queryString.stringify({
            status: true,
            message: "Updated successfully"
        });
        return res.redirect(`/edit/${user_id}?${withData}`);
    }
    else{
        let withData = queryString.stringify({
            status: false,
            message: 'something went wrong. try again'
        });
        return res.redirect(`/edit/${user_id}?${withData}`);
    }
}



const DeletePage = (req, res) => {
    return res.render('delete.ejs',{id: req.params.id});
}
const Delete = (req, res) => {
    return res.render('delete.ejs');
}


function validateInput(input){

    /*
        input = [{name: 'input name', required: true, value: ''}]
     */

    for (let i = 0; i < input.length; i++){
        let item = input[i];
        if(item.required == true){
            if((item.value == "" || item.value == undefined || item.value == null || item.value == "undefined")){
                return {
                    status: false,
                    message: item.name + " is required."
                };
                break;
            }

        }
    }

    return {
        status: true,
    };


}

module.exports = {HomePage,AddPage, Add, View, Edit, EditPage, DeletePage, Delete}