import { logout } from '../api/auth';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
    return useMutation({
        mutationFn: logout,
    });
};
