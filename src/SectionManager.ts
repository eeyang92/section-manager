export type UpdateSectionOptions = {
    startSection: number,
    endSection: number,
    indentChars: string,
    sectionContentArray: string[],
    padding?: boolean
}

export type SectionManagerOptions = {
    padding?: boolean,
    sectionSyntax?: {
        start: (name) => string,
        end: (name) => string
    }
}

export class SectionManager {
    fileArray: string[]
    padding: boolean
    sectionSyntax: {
        start: (name) => string,
        end: (name) => string
    }

    constructor(options: SectionManagerOptions) {
        this.padding = (options.padding) ? true : false
        this.sectionSyntax = (options.sectionSyntax) ? options.sectionSyntax : {
            start: (name) => `<-- ${ name }`,
            end: (name) => `--> ${ name }`
        }
    }

    setFileArray(fileArray) {
        this.fileArray = fileArray
    }

    getFileArray() {
        return this.fileArray
    }

    toString() {
        return this.fileArray.join('\n')
    }

    findSection(section: string) {
        let startSection = -1
        let endSection = -1
        let indentChars = ''

        const startSectionSyntax = this.sectionSyntax.start(section)
        const endSectionSyntax = this.sectionSyntax.end(section)

        for (let i = 0; i < this.getFileArray().length; i++) {
            const line = this.getFileArray()[i]

            if (startSection < 0) {
                const beginingOfSection = line.search(startSectionSyntax)

                if (beginingOfSection > -1) {
                    startSection = i
                }
            } else {
                const endOfSection = line.search(endSectionSyntax)

                if (endOfSection > -1) {
                    endSection = i

                    const lineArray = line.split('')

                    for (let j = 0; j < lineArray.length; j++) {
                        const character = lineArray[j]

                        
                        if (!isWhitespace(character)) {
                            break
                        }

                        indentChars += character
                    }

                    break
                }
            }
        }

        if (startSection < 0 || endSection < 0) {
            throw new Error(`${section} Section could not be identified`)
        }

        return {
            startSection,
            endSection,
            indentChars,
            section: this.getFileArray().slice(startSection, endSection)
        }
    }

    updateSection(options: UpdateSectionOptions) {
        const { startSection, endSection, indentChars, sectionContentArray, padding } = options
        const padding_ = (typeof padding !== 'undefined') ? padding : this.padding
    
        const indentedSectionContentArray = sectionContentArray.map((sectionContent) => {
            if (sectionContent.length > 0) {
                return `${indentChars}${sectionContent}`
            } else {
                return sectionContent
            }
        })
    
        if (padding_) {
            this.getFileArray().splice(startSection + 1, endSection - startSection - 1, '', ...indentedSectionContentArray, '')
        } else {
            this.getFileArray().splice(startSection + 1, endSection - startSection - 1, ...indentedSectionContentArray)
        }
    }

    findAndUpdateSection(section: string, sectionContentArray: string[], padding?: boolean) {
        const { startSection, endSection, indentChars } = this.findSection(section)
    
        this.updateSection({
            startSection,
            endSection,
            indentChars,
            sectionContentArray,
            padding
        })
    }

    prependToSection(section: string, sectionContentArray: string[]) {
        const { startSection, indentChars } = this.findSection(section)

        const indentedSectionContentArray = sectionContentArray.map((sectionContent) => {
            if (sectionContent.length > 0) {
                return `${indentChars}${sectionContent}`
            } else {
                return sectionContent
            }
        })
    
        this.getFileArray().splice(startSection + 1, 0, ...indentedSectionContentArray)
    }

    appendToSection(section: string, sectionContentArray: string[]) {
        const { endSection, indentChars } = this.findSection(section)

        const indentedSectionContentArray = sectionContentArray.map((sectionContent) => {
            if (sectionContent.length > 0) {
                return `${indentChars}${sectionContent}`
            } else {
                return sectionContent
            }
        })
    
        this.getFileArray().splice(endSection - 1, 0, ...indentedSectionContentArray)
    }
}

export class StringSectionManager extends SectionManager {
    constructor(fileString: string, options: SectionManagerOptions) {
        super(options)

        this.setFileArray(fileString.split('\n'))
    }
}

function isWhitespace(char: string) {
    return [' ', '\t'].includes(char)
}
