import { refreshTokenRequest } from "@/services/api";

export async function refreshAccessTokenHandler(refreshToken) {
  if (!refreshToken) {
    console.warn("Липсва refreshToken");
    return { success: false };
  }

  try {
    const data = await refreshTokenRequest(refreshToken);
    return {
      success: true,
      accessToken: data.accessToken,
    };
  } catch (error) {
    console.error("Грешка при опит за освежаване на access токен", error);
    return { success: false };
  }
}
