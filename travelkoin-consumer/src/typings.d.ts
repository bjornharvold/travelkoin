/*
 * Copyright (c) 2017. Traveliko PTE.LTD. All rights Reserved.
 */

// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html
declare module 'cloudinary-core';

// This one is for webpack and loading i18n json files
declare var System: System;

interface System {
    import(request: string): Promise<any>;
}

