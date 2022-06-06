export * from './Contentcreator';
export * from './Manufacturer';
export * from './Publisher';
export * from './Shop';
export * from './Sponsor';

export const organizationRoles = [
	'contentcreator',
	'manufacturer',
	'publisher',
	'shop',
	'sponsor',
];

import type {Contentcreator} from './Contentcreator'
import type {Manufacturer} from './Manufacturer'
import type {Publisher} from './Publisher'
import type {Shop} from './Shop'
import type {Sponsor} from './Sponsor'

export type OrganizationRole = Contentcreator | Manufacturer | Publisher | Shop | Sponsor
