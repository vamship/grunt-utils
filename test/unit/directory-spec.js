'use strict';

const _chai = require('chai');
_chai.use(require('sinon-chai'));
_chai.use(require('chai-as-promised'));

const expect = _chai.expect;
const _path = require('path');
const _process = require('process');
const _rewire = require('rewire');

let Directory = null;

describe('[Directory]', () => {

    function _createPath(...components) {
        return components.join(_path.sep);
    }

    beforeEach(() => {
        Directory = _rewire('../../src/directory');
    });

    describe('ctor()', () => {
        it('should throw an error if invoked without a valid path', () => {
            const error = 'Invalid path specified (arg #1)';
            [ null, undefined, 123, true, {}, [], () => {}].forEach((path) => {
                const wrapper = () => {
                    return new Directory(path);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should expose the expected methods and properties', () => {
            const dir = new Directory(_createPath('.', 'foo', 'bar'));

            expect(dir).to.be.an('object');
            expect(dir.name).to.be.a('string');
            expect(dir.path).to.be.a('string');
            expect(dir.addChild).to.be.a('function');
            expect(dir.getChildren).to.be.a('function');
            expect(dir.getFilePath).to.be.a('function');
            expect(dir.getAllFilesPattern).to.be.a('function');
        });
    });

    describe('name', () => {
        it('should return an empty string if the input path is the root character', () => {
            function doTest(path) {
                const dir = new Directory(path);
                expect(dir.name).to.equal('');
            }
            [_path.sep].forEach(doTest);
        });

        it('should return the name the current directory if the input path is empty or "."', () => {
            function doTest(path) {
                const dir = new Directory(path);
                expect(dir.name).to.equal(_path.basename(_process.cwd()));
            }

            ['', '.', `.${_path.sep}`, `.${_path.sep}.`].forEach(doTest);
        });

        it('should return the name of the directory if a relative path is specified', () => {
            function doTest(path) {
                const dir = new Directory(path);
                expect(dir.name).to.equal('baz');
            }

            [
                _createPath('foo', 'bar', 'baz'),
                _createPath('foo', 'bar', 'baz', '')
            ].forEach(doTest);
        });

        it('should return the name of the directory if an absolute path is specified', () => {
            function doTest(path) {
                const dir = new Directory(path);
                expect(dir.name).to.equal('baz');
            }
            [
                _createPath('', 'foo', 'bar', 'baz'),
                _createPath('', 'foo', 'bar', 'baz', '')
            ].forEach(doTest);
        });
    });

    describe('path', () => {
        it(`should return "${_path.sep} if the input path is "${_path.sep}"`, () => {
            const dir = new Directory(_path.sep);
            expect(dir.path).to.equal(_path.sep);
        });

        it('should use the resolved path to determine a standardized directory path', () => {
            function doTest(path) {
                const dir = new Directory(path);
                const expectedPath = _path.join(_path.basename(_process.cwd()), _path.sep);
                expect(dir.path).to.equal(expectedPath);
            }
            ['', '.', `.${_path.sep}`].forEach(doTest);
        });

        it('should return a standardized directory path when a relative path is specified', () => {
            function doTest(path) {
                const dir = new Directory(path);
                const expectedPath = _createPath('foo', 'bar', 'baz', '');
                expect(dir.path).to.equal(expectedPath);
            }
            [
                _createPath('foo', 'bar', 'baz'),
                _createPath('foo', 'bar', 'baz', '')
            ].forEach(doTest);
        });

        it('should return a standardized directory path when an absolute path is specified', () => {
            function doTest(path) {
                const dir = new Directory(path);
                const expectedPath = _createPath('', 'foo', 'bar', 'baz', '');
                expect(dir.path).to.equal(expectedPath);
            }
            [
                _createPath('', 'foo', 'bar', 'baz'),
                _createPath('', 'foo', 'bar', 'baz', '')
            ].forEach(doTest);
        });
    });

    describe('absolutePath', () => {
        it(`should return "${_path.sep} if the input path is "${_path.sep}"`, () => {
            const dir = new Directory(_path.sep);
            expect(dir.absolutePath).to.equal(_path.sep);
        });

        it('should use the resolved path to determine a standardized directory path', () => {
            function doTest(path) {
                const dir = new Directory(path);
                const expectedPath = _path.join(_path.resolve(path), _path.sep);
                expect(dir.absolutePath).to.equal(expectedPath);
            }
            ['', '.', `.${_path.sep}`].forEach(doTest);
        });

        it('should return a standardized directory path when a relative path is specified', () => {
            function doTest(path) {
                const dir = new Directory(path);
                let expectedPath = _createPath(_path.resolve(), 'foo', 'bar', 'baz', '');
                expect(dir.absolutePath).to.equal(expectedPath);
            }
            [
                _createPath('foo', 'bar', 'baz'),
                _createPath('foo', 'bar', 'baz', '')
            ].forEach(doTest);
        });

        it('should return a standardized directory path when an absolute path is specified', () => {
            function doTest(path) {
                const dir = new Directory(path);
                const expectedPath = _createPath('', 'foo', 'bar', 'baz', '');
                expect(dir.absolutePath).to.equal(expectedPath);
            }
            [
                _createPath('', 'foo', 'bar', 'baz'),
                _createPath('', 'foo', 'bar', 'baz', '')
            ].forEach(doTest);
        });
    });

    describe('addChild()', () => {
        it('should throw an error if invoked without a valid directory name', () => {
            const error = 'Invalid directoryName specified (arg #1)';
            [ null, undefined, 123, '', true, {}, [], () => {}].forEach((path) => {
                const wrapper = () => {
                    const dir = new Directory('');
                    return dir.addChild(path);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should throw an error if the name includes path separators', () => {
            const error = 'Directory name cannot include path separators (:, \\ or /)';
            [ '/', '\\', '/child', 'child/', 'child\\', '\\child', 'c:'].forEach((path) => {
                const wrapper = () => {
                    const dir = new Directory('');
                    return dir.addChild(path);
                };
                expect(wrapper).to.throw(error);
            });
        });

        it('should create and add a new Directory instance to the child array', () => {
            const dir = new Directory('');

            //NOTE: Examining "private" members.
            expect(dir._children).to.deep.equal([]);
            dir.addChild('baby');

            expect(dir._children).to.have.length(1);
            expect(dir._children[0]).to.be.an.instanceof(Directory);
        });

        it('should initialize the child directory with the correct path', () => {
            const parentPath = _createPath('foo', 'bar', 'baz');
            const childDirName = 'chaz';
            const dir = new Directory(parentPath);

            dir.addChild(childDirName);
            const refChild = new Directory(_path.join(parentPath, childDirName));

            //NOTE: Examining "private" members.
            expect(dir._children[0].path).to.equal(refChild.path);
            expect(dir._children[0].name).to.equal(refChild.name);
        });
    });

    describe('getChildren()', () => {
        it('should return an array containing all of the child directories', () => {
            const parent = new Directory('');
            const childDirectories = [ 'foo', 'bar', 'baz' ].map((path) => {
                return new Directory(path);
            });

            childDirectories.forEach(dir => parent._children.push(dir));

            const ret = parent.getChildren();
            expect(ret).to.deep.equal(childDirectories);
            expect(ret).to.not.equal(parent._children);
        });
    });

    describe('getFilePath()', () => {
        it('should return the path to the parent if invoked without a valid fileName', () => {
            [ null, undefined, 123, true, {}, [], () => {}].forEach((fileName) => {
                const dir = new Directory('');
                const ret = dir.getFilePath(fileName);

                expect(ret).to.equal(dir.path);
            });
        });

        it('should return the path to the filename as if it exists in the directory', () => {
            const fileName = 'test-file';
            const dir = new Directory('');
            const ret = dir.getFilePath(fileName);

            expect(ret).to.equal(_path.join(dir.path, fileName));
        });
    });

    describe('getAllFilesPattern()', () => {
        it('should return the expected globbing pattern when invoked without an extension', () => {
            const path = _createPath('foo', 'bar', 'baz');
            const expectedPattern = _createPath('foo', 'bar', 'baz', '**', '*');

            const dir = new Directory(path);
            const ret = dir.getAllFilesPattern();
            expect(ret).to.equal(expectedPattern);
        });

        it('should return the expected globbing pattern when invoked with an extension', () => {
            const extension = 'js';
            const path = _createPath('foo', 'bar');
            const expectedPattern = _createPath('foo', 'bar', '**', `*.${extension}`);

            const dir = new Directory(path);
            const ret = dir.getAllFilesPattern(extension);
            expect(ret).to.equal(expectedPattern);
        });
    });
});
