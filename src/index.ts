type KettuCommand = {
  name: string;
  displayName: string;
  description: string;
  displayDescription: string;
  options: never[];
  applicationId: string;
  inputType: number;
  type: number;
  execute: (_args: unknown[], ctx: { channel: { id: string }; guild: unknown }) => null;
};

type CommandRegistrar = {
  registerCommand: (command: KettuCommand) => () => void;
};

type MessageActions = {
  sendMessage: (
    channelId: string,
    message: { content: string },
    optimistic?: unknown,
    options?: { nonce: string },
  ) => void;
};

type BunnyApi = {
  api: { commands: CommandRegistrar };
  metro?: { findByProps: (...props: string[]) => MessageActions };
};

type VendettaApi = {
  commands: CommandRegistrar;
  metro: { findByProps: (...props: string[]) => MessageActions };
};

declare const bunny: BunnyApi;
declare const vendetta: VendettaApi;

const FACTS = [
  "Parrots have zygodactyl feet: two toes point forward and two point backward.",
  "Some parrots can live for more than 50 years, depending on the species.",
  "The kea is the world's only alpine parrot and lives in New Zealand's South Island.",
  "African grey parrots are famous for learning and using many human words in context.",
  "A parrot's beak keeps growing, so chewing helps keep it naturally trimmed.",
  "The kakapo is a nocturnal, flightless parrot and one of the world's rarest birds.",
  "Parrots use their tongues to help manipulate food and shape some of their calls.",
  "The hyacinth macaw is the largest flying parrot species.",
  "Many parrots form strong pair bonds and may cooperate when raising chicks.",
  "Parrots do not have vocal cords; they make sounds with an organ called the syrinx.",
  "Some parrots use their feet almost like hands when holding and eating food.",
  "The word 'parrot' is related to old French and Middle French words for the bird."
];

let unregister: (() => void) | undefined;

function getCommandRegistrar(): CommandRegistrar {
  if (typeof vendetta !== "undefined") return vendetta.commands;
  return bunny.api.commands;
}

function getMessageActions(): MessageActions {
  if (typeof vendetta !== "undefined") {
    return vendetta.metro.findByProps("sendMessage");
  }
  return bunny.metro!.findByProps("sendMessage");
}

const command: KettuCommand = {
  name: "parrotfact",
  displayName: "parrotfact",
  description: "Sends a random parrot fact.",
  displayDescription: "Sends a random parrot fact.",
  options: [],
  applicationId: "-1",
  inputType: 1,
  type: 1,
  execute: (_args, ctx) => {
    const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
    getMessageActions().sendMessage(
      ctx.channel.id,
      { content: `🦜 ${fact}` },
      void 0,
      { nonce: Date.now().toString() },
    );
    return null;
  },
};

function start() {
  unregister = getCommandRegistrar().registerCommand(command);
}

function stop() {
  unregister?.();
  unregister = undefined;
}

export default {
  start,
  stop,
  onLoad: start,
  onUnload: stop,
};
