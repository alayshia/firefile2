const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const server = require('../server');
const should = chai.should();
const dbURI = process.env.MONGODB_URL;


chai.use(chaiHttp);

describe('Server Tests', () => {

    // Before starting the tests, connect to the MongoDB database
    before(() => {
        mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        mongoose.Promise = global.Promise
    })

    beforeEach(async () => {
        await mongoose.connection.dropDatabase()
    })

    describe('/GET db-status', () => {
        it('it should GET the db status', (done) => {
            chai.request(server)
                .get('/db-status')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('status');
                    done();
                });
        });
    });

    describe('/POST download', () => {
        it('it should not download the file without URL', (done) => {
            let downloadData = {
                storeInMongo: false,
                destination: "/tmp",
                filename: "testfile.txt"
            }
            chai.request(server)
                .post('/download')
                .send(downloadData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error').eql('Invalid URL provided.');
                    done();
                });
        });
    });

    describe('/HEAD check-size', () => {
        it('it should return the size of the file from a given URL', (done) => {
            let sizeData = {
                url: "https://www.example.com/sample.txt"
            }
            chai.request(server)
                .head('/check-size')
                .send(sizeData)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('size');
                    done();
                });
        });

        it('it should return error for invalid URL', (done) => {
            let sizeData = {
                url: "invalidURL"
            }
            chai.request(server)
                .head('/check-size')
                .send(sizeData)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('error').eql('Invalid URL provided.');
                    done();
                });
        });
    });

    describe('/GET unique-file/:filename', () => {
        it('it should check if a filename is unique', (done) => {
            chai.request(server)
                .get('/unique-file/testfile.txt')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('isUnique');
                    done();
                });
        });
    });

    describe('/GET downloads', () => {
        it('it should fetch all downloads', (done) => {
            chai.request(server)
                .get('/downloads')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('files');
                    done();
                });
        });
    });

    describe('/GET download/:filename', () => {
        it('it should fetch a specific download by filename', (done) => {
            let filename = "testfile.txt";
            chai.request(server)
                .get(`/download/${filename}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('filename').eql(filename);
                    done();
                });
        });

        it('it should return 404 for non-existent filename', (done) => {
            let filename = "nonexistentfile.txt";
            chai.request(server)
                .get(`/download/${filename}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('error').eql('Download not found.');
                    done();
                });
        });
    });

    describe('/DELETE download/:filename', () => {
        it('it should delete a specific download by filename', (done) => {
            let filename = "testfile.txt";
            chai.request(server)
                .delete(`/download/${filename}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message');
                    done();
                });
        });

        it('it should return 404 for non-existent filename to delete', (done) => {
            let filename = "nonexistentfile.txt";
            chai.request(server)
                .delete(`/download/${filename}`)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.have.property('error').eql('Download not found.');
                    done();
                });
        });
    });


    // After all tests have finished, disconnect from the MongoDB database
    after(function (done) {
        mongoose.connection.close(done);
    });
});

