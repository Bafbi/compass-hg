/*
IT
BE Mécanique
BE Electrique
Montage
Qualité
Magasin
Usinage
Achats
SPD
ADV
RH
Commercial
R&D
Peinture
*/
export const serviceEnum = [
	'IT',
	'BE Mécanique',
	'BE Electrique',
	'Montage',
	'Qualité',
	'Magasin',
	'Usinage',
	'Achats',
	'SPD',
	'ADV',
	'RH',
	'Commercial',
	'R&D',
	'Peinture'
] as const;
export type Service = (typeof serviceEnum)[number];

export const serviceEnumIded = () => {
	const status: { id: string }[] = [];
	serviceEnum.forEach((v) => status.push({ id: v }));
	return status;
};

export const statusEnum = ['Ouvert', 'Fermé', 'En Attente', 'Plannifier'] as const;
export type Status = (typeof statusEnum)[number];

export const statusEnumIded = () => {
	const status: { id: string }[] = [];
	statusEnum.forEach((v) => status.push({ id: v }));
	return status;
};

export function isEnumValue<T extends string>(enumArray: readonly T[], value: string): value is T {
	return enumArray.includes(value as T);
}
