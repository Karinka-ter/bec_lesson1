import express, {Express} from "express";
import {db} from './db/db'
import {Video} from "./videos/types/videos";
import {HttpStatus} from "./core/http-statuses";
import {videoInputDtoValidation} from "./videos/validations/vehicleInputDtoValidation";


export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    // основной роут
    app.get("/", (req, res) => {
        res.status(HttpStatus.Ok).send("Hello world!");
    });

    app.get("/videos", (req, res) => {
        res.status(HttpStatus.Ok).send(db.videos);
    });

    app.get("/videos/:id", (req, res) => {
        const video = db.videos.find((video) => video.id === Number(req.params.id));
        if (video) {
           return  res.status(HttpStatus.Ok).send(video);
        }
       return res.sendStatus(HttpStatus.NotFound);
    });

    app.post("/videos", (req, res) => {
        const errors  = videoInputDtoValidation(req.body);
        if(errors.length>0) {
          return res.status(HttpStatus.BadRequest).send({
                errorsMessages: errors
            });
        }
        const now = new Date();
        const newVideo: Video = {
            ...req.body,
            id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
            canBeDownloaded: req.body.canBeDownloaded ?? false,
            createdAt: now,
            publicationDate: req.body.publicationDate || new Date(now.getTime() + 24 * 60 * 60 * 1000),
        };

        db.videos.push(newVideo);
        //4) возвращаем ответ
        return res.status(HttpStatus.Created).send(newVideo)
    })

    app.put("/videos/:id", (req, res) => {
        const video = db.videos.find(v => v.id === Number(req.params.id));

        const errors = videoInputDtoValidation(req.body);
        if (errors.length > 0) {
            return res.status(HttpStatus.BadRequest).send({ errorsMessages: errors });
        }

        if (!video) {
            return res.sendStatus(HttpStatus.NotFound);
        }

        video.title = req.body.title;
        video.author = req.body.author;
        video.availableResolutions = req.body.availableResolutions;
        video.canBeDownloaded = req.body.canBeDownloaded;
        video.minAgeRestriction = req.body.minAgeRestriction;
        video.publicationDate = req.body.publicationDate;

        return res.sendStatus(HttpStatus.NoContent);
    });

    app.delete("/videos/:id", (req, res) => {
        const index = db.videos.findIndex(v => v.id === Number(req.params.id));
        if (index === -1) {
            return res.sendStatus(HttpStatus.NotFound);
        }
        db.videos.splice(index, 1);
        res.sendStatus(HttpStatus.NoContent);
    });

    return app;
};

