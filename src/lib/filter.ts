import { isEnumValue, statusEnum, type Service, type Status, serviceEnum } from './const';

export type TicketsFilters = {
	service: Service | null;
	status: Status | null;
	labels: string[];
	requester: string | null;
	search: string[];
};

type TicketsFiltersKeys = keyof TicketsFilters;

export type FilterTypeStrings = 'is' | 'label' | 'from' | 'by';

type TicketsFiltersMapping = {
	[K in FilterTypeStrings]: TicketsFiltersKeys;
};

const TicketsFiltersTypes: TicketsFiltersMapping = {
	is: 'status',
	label: 'labels',
	from: 'service',
	by: 'requester'
};

export function getFilterKey<K extends FilterTypeStrings>(filterType: K): TicketsFiltersMapping[K] {
	return TicketsFiltersTypes[filterType];
}

export function getFilterType<K extends TicketsFiltersKeys>(
	filterKey: K
): FilterTypeStrings | undefined {
	return Object.keys(TicketsFiltersTypes).find(
		(key) => TicketsFiltersTypes[key as FilterTypeStrings] === filterKey
	) as FilterTypeStrings | undefined;
}

export function constructQueryString(filters: TicketsFilters): string {
	let queryString = '';

	Object.keys(filters).forEach((key) => {
		const filterType = getFilterType(key as TicketsFiltersKeys);
		if (filterType && filters[key]!) {
			if (Array.isArray(filters[key])) {
				filters[key].forEach((value) => {
					queryString += `${filterType}:${value} `;
				});
			} else {
				queryString += `${filterType}:${filters[key]} `;
			}
		} 
	});
    
	return queryString;
}

export function appendQuery(
	filters: TicketsFilters,
	type: FilterTypeStrings,
	value: string
): string {
	const filterKey = getFilterKey(type);
	const tmpFilters = { ...filters };
	if (filterKey) {
		if (Array.isArray(filters[filterKey])) {
			tmpFilters[filterKey] = [...tmpFilters[filterKey], value];
		} else {
			tmpFilters[filterKey] = value;
		}
	}
	return constructQueryString(tmpFilters);
}

export function removeQuery(
	filters: TicketsFilters,
	type: FilterTypeStrings,
	value: string
): string {
	const filterKey = getFilterKey(type);
	const tmpFilters = { ...filters };
	if (filterKey) {
		if (Array.isArray(filters[filterKey])) {
			tmpFilters[filterKey] = tmpFilters[filterKey].filter((v) => v !== value);
		} else {
			tmpFilters[filterKey] = undefined;
		}
	}
	return constructQueryString(tmpFilters);
}

export function removeMultipleQuery(
    filters: TicketsFilters,
    type: FilterTypeStrings,
    values: string[]
): string {
    const filterKey = getFilterKey(type);
    const tmpFilters = { ...filters };
    if (filterKey) {
        if (Array.isArray(filters[filterKey])) {
            tmpFilters[filterKey] = tmpFilters[filterKey].filter((v) => !values.includes(v));
        } else {
            tmpFilters[filterKey] = undefined;
        }
    }
    
    return constructQueryString(tmpFilters);
}

/// if one key is present in the query string, it will be added to the filters object.
/// if there is no keyword, the partie with not keyword is added to the search keyword.
export const parseQueryString = (query: string): TicketsFilters => {
	return query.split(' ').reduce(
		(acc, query) => {
			const [type, value] = query.split(':');
			switch (type) {
				case 'is':
					console.log('is', value);

					if (isEnumValue(statusEnum, value)) {
						console.log('it is');

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
					acc.search = [...(acc.search || []), value];
					break;
				default:
					acc.search = [...(acc.search || []), type];
			}
			return acc;
		},
		{ labels: [], search: [] } as unknown as TicketsFilters
	);
};
