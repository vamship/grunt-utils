'use strict';

/**
 * Root module that exports components from the library.
 */
const index = {
    /**
     * Reference to the directory component.
     *
     * @return {Directory} A class that represents a directory on the file system.
     */
    Directory: require('./directory')
};

module.exports = index;
