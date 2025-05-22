"use server";

import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

// Interface para os parâmetros da nossa função
interface CreateTeamsMeetingParams {
  subject: string;
  startTimeISO: string;    // Data/hora de início no formato ISO 8601 (UTC preferencialmente)
  endTimeISO: string;      // Data/hora de término no formato ISO 8601 (UTC preferencialmente)
  attendees: {
    emailAddress: {
      address: string;
      name?: string;
    };
    type: "required" | "optional" | "resource"; // Geralmente "required"
  }[];
  bodyContent?: string; // Conteúdo do corpo do convite (pode ser HTML)
  timeZone?: string;    // Fuso horário a ser usado para o evento. Ex: "America/Sao_Paulo"
}

interface TeamsMeetingResponse {
    id?: string; // ID do evento no Graph
    joinUrl?: string | null; // Link para entrar na reunião do Teams
    errorMessage?: string;
  }

  export async function createTeamsMeeting({
    subject,
    startTimeISO,
    endTimeISO,
    attendees,
    bodyContent = "Devolutiva agendada através da plataforma.", // Corpo padrão
    timeZone = "America/Sao_Paulo", // Defina um padrão ou pegue do usuário/sistema
  }: CreateTeamsMeetingParams): Promise<TeamsMeetingResponse> {
    const session = await getServerSession(authOptions);
  
    // Verifique se session.accessToken é o token de acesso para o Microsoft Graph
    // O nome exato da propriedade pode variar dependendo da sua configuração do NextAuth (jwt callback)
    const accessToken = session?.accessToken; // ou session?.user?.accessToken
  
    if (!accessToken) {
      console.error("[TeamsAction] Token de acesso do Microsoft Graph não encontrado na sessão.");
      return { errorMessage: "Autenticação necessária ou token inválido para o Microsoft Graph." };
    }
  
    const meetingData = {
      subject: subject,
      body: {
        contentType: "HTML", // Ou "Text"
        content: bodyContent,
      },
      start: {
        dateTime: startTimeISO,
        timeZone: timeZone,
      },
      end: {
        dateTime: endTimeISO,
        timeZone: timeZone,
      },
      attendees: attendees,
      isOnlineMeeting: true,
      onlineMeetingProvider: "teamsForBusiness",
      // Opcional: configurações para a reunião online
      // allowNewTimeProposals: true, // Se os participantes podem propor novo horário
      // onlineMeeting: { // Para controle mais fino da reunião Teams
      //   lobbyBypassSettings: {
      //     scope: "everyone", // Ex: 'organization', 'everyone'
      //     isLobbyBypassEnabled: true
      //   }
      // }
    };
  
    try {
      // A reunião é criada no calendário do usuário autenticado ("me")
      const response = await fetch("https://graph.microsoft.com/v1.0/me/events", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(meetingData),
      });
  
      const responseData = await response.json();
  
      if (!response.ok) {
        console.error("[TeamsAction] Erro da API do Graph ao criar evento:", response.status, responseData);
        const errorMessage = responseData.error?.message || `Falha ao criar reunião no Teams (HTTP ${response.status})`;
        return { errorMessage };
      }
  
      console.log("[TeamsAction] Reunião do Teams criada com sucesso:", responseData.id, responseData.onlineMeeting?.joinUrl);
      return {
        id: responseData.id,
        joinUrl: responseData.onlineMeeting?.joinUrl,
      };
    } catch (error) {
      console.error("[TeamsAction] Exceção ao chamar a API do Graph:", error);
      if (error instanceof Error) {
        return { errorMessage: `Exceção ao criar reunião: ${error.message}` };
      }
      return { errorMessage: "Ocorreu uma exceção desconhecida ao criar a reunião." };
    }
  }