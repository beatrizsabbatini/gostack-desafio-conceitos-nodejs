const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

const repositories = [];

function validateId(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ message: "This id is invalid!" })
  }
  return next();
}

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(item => item.id == id);

  if (repositoryIndex == -1){
    return response.status(400).send({ error: "Repository not found!" });
  }

  const repositoryUpdated = {
    id, 
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  }

  repositories[repositoryIndex] = repositoryUpdated;

  return response.status(200).json(repositoryUpdated);
 
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(item => item.id == id);

  if (repositoryIndex >= 0){
    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  } else {
    return response.status(400).json({ error: "This repository doesn´t exist!"})
  }

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(item => item.id == id);

  if (repositoryIndex == -1){
    return response.status(400).send({ error: "This repository doesn´t exist!"});
  }

  repositories[repositoryIndex].likes += 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
