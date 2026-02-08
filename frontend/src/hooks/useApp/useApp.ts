import { appContext } from '@context';
import { useContext } from 'react';

export const useApp = () => useContext(appContext);
