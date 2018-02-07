'use strict';

const _path = require('path');

/**
 * Abstract representation of a directory, with methods for traversal and
 * pattern generation.
 */
class Directory {
    /**
     * @param {String} dirPath The path represented by this directory.
     */
    constructor(dirPath) {
        if(typeof dirPath !== 'string') {
            throw new Error('Invalid path specified (arg #1)');
        }

        let relativePath = dirPath;
        if(!_path.isAbsolute(dirPath)) {
            relativePath = relativePath.replace(process.cwd(), '');
        }
        relativePath = _path.dirname(relativePath);
        this._name = _path.basename(_path.resolve(dirPath));
        this._path = _path.join(relativePath, this._name, _path.sep);
        this._absolutePath = _path.join(_path.resolve(dirPath), _path.sep);
        this._children = [];
    }

    /**
     * Returns the name of the directory.
     *
     * @return {String} The name of the directory
     */
    get name() {
        return this._name;
    }

    /**
     * Returns the path corresponding to this directory.
     *
     * @return {String} The path that this directory object was initialized
     *         with.
     */
    get path() {
        return this._path;
    }

    /**
     * Returns the absolute path to this directory.
     *
     * @return {String} The absolute path that this directory object was
     *         initialized with.
     */
    get absolutePath() {
        return this._absolutePath;
    }

    /**
     * Adds a child directory object to the current directory.
     *
     * @param {String} directoryName Name of the child directory.
     */
    addChild(directoryName) {
        if(typeof directoryName !== 'string' || directoryName.length <= 0) {
            throw new Error('Invalid directoryName specified (arg #1)');
        }
        if (directoryName.match(/[\\\/:]/)) {
            throw new Error('Directory name cannot include path separators (:, \\ or /)');
        }
        const child = new Directory(_path.join(this.path, directoryName));
        this._children.push(child);
    }

    /**
     * Returns an array containing all first level children of the current
     * directory.
     *
     * @return {Directory[]} An array of first level children for the directory.
     */
    getChildren() {
        return this._children.slice();
    }

    /**
     * Returns the path to a file within the specified directory. This file
     * does not have to actually exist on the file system.
     *
     * @param {String} fileName The name of the file.
     * @return {String} The path to the file including the current directory
     *         path.
     */
    getFilePath(fileName) {
        if(typeof fileName !== 'string') {
            fileName = '';
        }
        return _path.join(this.path, fileName);
    }

    /**
     * Gets a string glob that can be used to match all folders/files in the
     * current folder and all sub folders, optionally filtered by file
     * extension.
     *
     * @param {String} [extension] An optional extension to use when generating
     *        a globbing pattern.
     */
    getAllFilesPattern(extension) {
        // extension = (extension && '*.' + extension) || '*';
        if(typeof extension !== 'string') {
            extension = '*';
        } else {
            extension = `*.${extension}`;
        }
        return _path.join(this.path, '**', extension);
    }

}

module.exports = Directory;