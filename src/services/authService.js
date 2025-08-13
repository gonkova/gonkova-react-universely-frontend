import { refreshTokenRequest } from "@/services/api";

export async function refreshAccessTokenHandler(refreshToken) {
  if (!refreshToken) {
    console.warn("Липсва refreshToken");
    return { success: false };
  }

  try {
    // Очакваме backend да върне { accessToken, refreshToken? }
    const data = await refreshTokenRequest(refreshToken);
    return {
      success: true,
      accessToken: data.accessToken,
      refreshToken: data.refreshToken ?? null,
    };
  } catch (error) {
    console.error("Error while trying to refresh access token", error);
    return { success: false };
  }
}
