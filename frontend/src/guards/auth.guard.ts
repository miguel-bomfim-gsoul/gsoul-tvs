import { inject } from "@angular/core";
import { CanActivateChildFn, Router } from "@angular/router";
import { AuthGoogleService } from "../services/auth-google.service";

export const AuthGuard: CanActivateChildFn = async  () => {
    const authService = inject(AuthGoogleService)
    const router = inject(Router)

    await authService.ensureLoginInitialized();

    if(authService.isLoggedIn()) {
        return true
    } else {
        router.navigate(['/login'])
        return false
    }
}