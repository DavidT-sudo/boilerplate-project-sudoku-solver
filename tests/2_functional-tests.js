
const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzleStrings = require('../controllers/puzzle-strings.js').puzzlesAndSolutions;

chai.use(chaiHttp);

suite('Functional Tests', () => {

/*
  1.  Solve a puzzle with valid puzzle string: POST request to /api/solve
  2.  Solve a puzzle with missing puzzle string: POST request to /api/solve
  3.  Solve a puzzle with invalid characters: POST request to /api/solve
  4.  Solve a puzzle with incorrect length: POST request to /api/solve
  5.  Solve a puzzle that cannot be solved: POST request to /api/solve
  6.  Check a puzzle placement with all fields: POST request to /api/check
  7.  Check a puzzle placement with single placement conflict: POST request to /api/check
  8.  Check a puzzle placement with multiple placement conflicts: POST request to /api/check
  9.  Check a puzzle placement with all placement conflicts: POST request to /api/check
  10. Check a puzzle placement with missing required fields: POST request to /api/check
  11. Check a puzzle placement with invalid characters: POST request to /api/check
  12. Check a puzzle placement with incorrect length: POST request to /api/check
  13. Check a puzzle placement with invalid placement coordinate: POST request to /api/check
  14. Check a puzzle placement with invalid placement value: POST request to /api/check
*/

    suite('functional tests to /api/solve', () => {
        //test 1
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: puzzleStrings[0][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, puzzleStrings[0][1]);
                done();
            })
        })

        //test 2
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing');
                done();
            })
        })

        //test 3
        test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
            puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37a"
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle');
                done();
            })
        })
        //test 4
        test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.3777"
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                done();
            })
        })

        //test 5
        test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/solve')
            .send({
                puzzle: ".7.897....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6"
            })
            .end((err, res)=>{
                console.log("res.body = ", res.body);
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved');
                done();
            })
        })
    })

    suite('functional tests to /api/check', () => {
    
        //test 6
        test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "E6",
            value: 2,
            puzzle: puzzleStrings[1][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isTrue(res.body.valid);
                done();
            })
        })

        //test 7
        test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "B6",
            value: 2,
            puzzle: puzzleStrings[2][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid)
                assert.deepEqual(res.body.conflict, ["column"]);
                done();
            })
        })

        //test 8
        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "B6",
            value: 9,
            puzzle: puzzleStrings[2][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid)
                assert.deepEqual(res.body.conflict, [ "row", "region" ])
                done()
            })
        })

        //test 9
        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "F8",
            value: 7,
            puzzle: puzzleStrings[2][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.isFalse(res.body.valid)
                assert.deepEqual(res.body.conflict, [  "row", "column", "region" ])
                done();
            })
        })

        //test 10
        test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            value: 7,
            puzzle: puzzleStrings[2][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field(s) missing");
                done();
            })
        })
        //test 11
        test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "F8",
            value: "fsda",
            puzzle: puzzleStrings[2][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value");
                done();
            })
        })

        //test 12
        test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "F8",
            value: "1",
            puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.33"
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
                done();
            })
        })

        //test 13
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
                coordinate: "j8",
                value: "1",
                puzzle: puzzleStrings[0][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid coordinate");
                done();
            })
        })

        //test 14
        test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
        chai
            .request(server)
            .keepOpen()
            .post('/api/check')
            .send({
            coordinate: "d5",
            value: "aad",
            puzzle: puzzleStrings[2][0]
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value");
                done();
            })
        })

    })

});

