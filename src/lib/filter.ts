/// This is a utility lib that simplifies the use of a inline query string in the url.
/// This is an example of query string: "from:IT is:CANCEL"
/// This is an example of query string: "from:IT is:CANCEL label:bug"

import { isEnumValue, serviceEnum, statusEnum, type Service, type Status } from "./server/schema";

export class TicketsFilters {
	query: string;
	service?: Service;
	status?: Status;
	labels?: string[];
	requester?: string;
	search?: string;

    constructor(query: string) {
        this.query = query;
    }

    // Recreate the query string from the filters object with the new filter.
    // It will replace the type that is already present in the query string.
    createAppendQuery(type: string, value: string) {
        const query = this.query.split(' ').filter((query) => {
            const [t] = query.split(':');
            return t !== type;
        });
        return [...query, `${type}:${value}`].join(' ');
    }



};

/// if one key is present in the query string, it will be added to the filters object.
/// if there is no keyword, the partie with not keyword is added to the search keyword.
export const parseQueryString = (query: string): TicketsFilters => {
	return query.split(' ').reduce(
		(acc, query) => {
			const [type, value] = query.split(':');
			switch (type) {
				case 'is':
					if (isEnumValue(statusEnum, value)) {
						// acc.status = [...(acc.status || []), value];
                        acc.status = value;
					}
					break;
				case 'label':
					acc.labels = [...(acc.labels || []), value];
					break;
				case 'from':
					if (isEnumValue(serviceEnum, value)) {
                        // acc.service = [...(acc.service || []), value];
                        acc.service = value;
                    }
					break;
				case 'by':
					acc.requester = value;
					break;
				case 'search':
                    acc.search = value;
                    break;
                default:
                    acc.search = type;
			}
			return acc;
		},
		{ query: query } as TicketsFilters
	);
};

