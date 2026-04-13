import {VideoQuality} from "../types/videos";

export const videoInputDtoValidation = (data: any,): any[] => {
    const errors: any[] = [];

    if (
        !data.title ||
        typeof data.title !== 'string' ||
        data.title.trim().length > 40
    ) {
        errors.push({ field: 'title', message: 'Title is required maxLength 40' });
    }

    if (
        !data.author ||
        typeof data.author !== 'string' ||
        data.author.trim().length > 20
    ) {
        errors.push({ field: 'author', message: 'Author is required maxLength 20' });
    }

    if (
        data.canBeDownloaded !== undefined &&
        typeof data.canBeDownloaded !== 'boolean'
    ) {
        errors.push({
            field: 'canBeDownloaded',
            message: 'canBeDownloaded must be boolean',
        });
    }

    if (
        data.publicationDate !== undefined &&
        data.publicationDate !== null &&
        isNaN(Date.parse(data.publicationDate))
    ) {
        errors.push({
            field: 'publicationDate',
            message: 'publicationDate must be valid ISO string',
        });
    }

    if (
        data.minAgeRestriction !== null &&
        data.minAgeRestriction !== undefined &&
        (typeof data.minAgeRestriction !== 'number' ||
            data.minAgeRestriction < 1 ||
            data.minAgeRestriction > 18)
    ) {
        errors.push({
            field: 'minAgeRestriction',
            message: 'minAgeRestriction must be number from 1 to 18',
        });
    }



    if (!Array.isArray(data.availableResolutions)) {
        errors.push({
            field: 'VideoQuality',
            message: 'VideoQuality must be array',
        });
    } else if (data.availableResolutions.length) {
        const existingFeatures = Object.values(VideoQuality);
        if (
            data.availableResolutions.length > existingFeatures.length ||
            data.availableResolutions.length < 1
        ) {
            errors.push({
                field: 'VideoQuality',
                message: 'Invalid VideoQuality',
            });
        }
        for (const feature of data.availableResolutions) {
            if (!existingFeatures.includes(feature)) {
                errors.push({ field: 'availableResolutions', message: 'Invalid resolution: ' + feature });
                break;
            }
        }
    }

    return errors;
};