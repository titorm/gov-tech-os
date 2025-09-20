import { municipios } from './schemas/municipios';
import { usersToMunicipios } from './schemas/usersToMunicipios';

// Simple type-only usage to ensure schemas compile in tsc
type A = typeof municipios;
type B = typeof usersToMunicipios;

const _a: A = municipios;
const _b: B = usersToMunicipios;

export { _a, _b };
