const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkExistsRepositories(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.status(404).json({ error: "Repository not found" });

  request.repositoryIndex = repositoryIndex;
  next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", checkExistsRepositories, (request, response) => {
  const { repositoryIndex } = request;
  const { title, url, techs } = request.body;

  // function removeAttr(data) {
  //   Object.keys(data).forEach((key) => {
  //     if (data[key] && typeof data[key] === "object") {
  //       removeEmpty(data[key]);
  //       if (Object.keys(data[key]).length === 0) delete data[key];
  //     } else if (
  //       data[key] == null ||
  //       data[key] === "" ||
  //       (typeof data[key] === "object" && data[key].length === 0)
  //     ) {
  //       delete data[key];
  //     }
  //   });

  //   return data;
  // }
  // const updatedRepository = removeAttr({ title, url, techs });

  const updatedRepository = {};

  title && (updatedRepository.title = title);
  url && (updatedRepository.url = url);
  techs && (updatedRepository.techs = techs);

  const repository = { ...repositories[repositoryIndex], ...updatedRepository };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete(
  "/repositories/:id",
  checkExistsRepositories,
  (request, response) => {
    const { repositoryIndex } = request;

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
  }
);

app.post(
  "/repositories/:id/like",
  checkExistsRepositories,
  (request, response) => {
    const { repositoryIndex } = request;

    const likes = ++repositories[repositoryIndex].likes;

    return response.json({ likes });
  }
);

module.exports = app;
