# Section Manager

Lightweight section management of multi-line Strings, with no external dependencies.

## Installation

- `npm install section-manager`, or
- `yarn add section-manager`

## Example

```typescript
import { StringSectionManager } from 'section-manager'

const testString = 
`Hello
World!

<-- MySection

Test

--> MySection

Bye!`

const stringSectionManager = new StringSectionManager(testString)

const updatedSection = ['One', 'Two', 'Three']

stringSectionManager.findAndUpdateSection('MySection', updatedSection)

console.log(stringSectionManager.toString())
```

```typescript
/* Output
Hello
World!

<-- MySection

One
Two
Three

--> MySection

Bye!
*/

```

## API

- This module exports `StringSectionManager` and `SectionManager`
    - It is recommended to use `StringSectionManager` as its constructor takes in a `string` as an argument and automatically assigns it to the internal array

### StringSectionManager
```typescript
StringSectionManager(fileString: string, options: SectionManagerOptions): StringSectionManager
```

### SectionManager
```typescript
StringSectionManager(options: SectionManagerOptions): SectionManager
```

```typescript
type SectionManagerOptions = {
    padding?: boolean,
    sectionSyntax?: {
        start: (name) => string,
        end: (name) => string
    }
}
```

- `padding`: controls whether or not there should be a new line after the section start and before the section end
    - This setting can be overridden on the update methods
- `sectionSyntax`: gives the developer control over the syntax for delimiting each section
    - Defaults:
        - start: ``(name) => `<-- ${ name }` ``
        - end: ``(name) => `--> ${ name }` ``

### Methods

#### findAndUpdateSection
```typescript
findAndUpdateSection(section: string, sectionContentArray: string[], padding?: boolean): void
```

#### prependToSection
```typescript
prependToSection(section: string, sectionContentArray: string[]): void
```

#### appendToSection
```typescript
appendToSection(section: string, sectionContentArray: string[]): void
```

#### toString
```typescript
toString(): string
```

The following are internal methods, but are exposed for cases that require manual control

#### findSection
```typescript
findSection(section: string): {
    startSection: number,
    endSection: number,
    indentChars: number,
    section: string[]
}
```

#### updateSection
```typescript
updateSection(options: UpdateSectionOptions): void
```

```typescript
type UpdateSectionOptions = {
    startSection: number,
    endSection: number,
    indentChars: string,
    sectionContentArray: string[],
    padding?: boolean
}
```

#### setFileArray
```typescript
setFileArray(fileArray: string[]): void
```

#### getFileArray
```typescript
getFileArray(): string[]
```

## Extending

You can extend the behavior by extending the base class `SectionManager`. For example, as shown in https://github.com/eeyang92/file-section-manager:

```typescript
import * as fs from 'fs'

import { SectionManager } from 'section-manager'

export class FileSectionManager extends SectionManager {
    absolutePathFileName: string

    constructor(absolutePathFileName: string, options: SectionManagerOptions) {
        super(options)

        if (!fs.existsSync(absolutePathFileName) ){
            throw new Error('File not found')
        }

        this.absolutePathFileName = absolutePathFileName

        this.readSync()
    }

    readSync() {
        const fileString = fs.readFileSync(this.absolutePathFileName).toString()

        this.setFileArray(fileString.split('\n'))
    }

    writeSync() {
        fs.writeFileSync(this.absolutePathFileName, this.getFileArray().join('\n'))
    }
}
```
