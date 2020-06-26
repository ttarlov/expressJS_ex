const express = require('express');
const app = express();
app.use(express.json());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';

app.get('/', (request, response) => {
    response.send('Oh hey Pet Box');
});

app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});


app.get('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params;
    const pet = app.locals.pets.find(pet => pet.id === id);
    if (!pet) {
    return response.sendStatus(404);
}

response.status(200).json(pet);
});


app.locals.pets = [
    { id: 'a1', name: 'Rover', type: 'dog' },
    { id: 'b2', name: 'Marcus Aurelius', type: 'parakeet' },
    { id: 'c3', name: 'Craisins', type: 'cat' }
];

app.get('/api/v1/pets', (request, response) => {
const pets = app.locals.pets;

response.json({ pets });
});



app.post('/api/v1/pets', (request, response) => {
const id = Date.now();
const pet = request.body;

for (let requiredParameter of ['name', 'type']) {
if (!pet[requiredParameter]) {
    return response
    .status(422)
    .send({ error: `Expected format: { name: <String>, type: <String> }. You're missing a "${requiredParameter}" property.` });
}
}

const { name, type } = pet;
app.locals.pets.push({ name, type, id });
response.status(201).json({ name, type, id });
});

const deletePet = (id) => {
    app.locals.pets = app.locals.pets.filter(pet => {
        return pet.id !== id
    })
}


app.patch('/api/v1/pets/:id', (request, response) => {
    const { id } = request.params
    
    const petToChange = app.locals.pets.find(pet => pet.id === id) 

    if(!petToChange) {
        return response
        .status(404)
        .send({error: `No Pet Found with an id of ${id}`})
    }else {
        petToChange.name = request.body.name
        return response
        .status(202)
        .json({petToChange})
    }

});

app.delete('/api/v1/pets', (request, response) => {
    console.log(request.body.id)
    // const { id } = request.params
    
    const petToDelete = app.locals.pets.find(pet => pet.id === request.body.id)

    if(!petToDelete) {
        return response
        .status(404)
        .send({error: `No Pet Found with an id of ${id}`})
    } else {
        deletePet(request.body.id)
        return response
        .status(202)
        .json(app.locals.pets)
    }

})