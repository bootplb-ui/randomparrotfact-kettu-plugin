type CommandResult = { content: string; tts?: boolean };

type KettuCommand = {
  name: string;
  description: string;
  options: never[];
  shouldHide: () => boolean;
  execute: (_args: unknown[], ctx: { channel: unknown; guild: unknown }) => CommandResult;
};

type KettuApi = {
  api: {
    commands: {
      registerCommand: (command: KettuCommand) => () => void;
    };
  };
};

declare const bunny: KettuApi;
declare const vendetta: KettuApi;

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

const command: KettuCommand = {
  name: "parrotfact",
  description: "Get a random parrot fact.",
  options: [],
  // Kettu's command filter keeps commands whose shouldHide() is not false.
  shouldHide: () => true,
  execute: () => {
    const fact = FACTS[Math.floor(Math.random() * FACTS.length)];
    return { content: `🦜 ${fact}` };
  }
};

function getApi(): KettuApi {
  // The legacy installer provides `vendetta`; the newer Bunny loader provides `bunny`.
  return typeof vendetta !== "undefined" ? vendetta : bunny;
}

function start() {
  unregister = getApi().api.commands.registerCommand(command);
}

function stop() {
  unregister?.();
  unregister = undefined;
}

export default {
  start,
  stop,
  onLoad: start,
  onUnload: stop
};
