import { Locale } from '@core/enums/locale.enum';
import { ProjectId } from '@core/enums/project-id.enum';
import type { ProjectEntry } from '@core/types/project.types';

/** Newest first. Repositories are private, so no source links yet. */
export const PROJECTS: readonly ProjectEntry[] = [
  {
    id: ProjectId.PolygonReconstruction,
    title: {
      [Locale.En]: 'Reconstructing a hidden polygon from proximity queries',
      [Locale.Fr]: 'Reconstruire un polygone caché à partir de requêtes de proximité',
    },
    summary: {
      [Locale.En]:
        'If a shape is hidden, can you rebuild it only by asking which point of its boundary is closest to a point you choose? The question comes from counterfactual explanations in AI: enough of them may give away a model’s whole decision boundary. I design query algorithms that recover an unknown polygon, from the convex case to non-convex shapes whose boundary is hard to reach, and study when exact reconstruction is possible and how many queries it takes.',
      [Locale.Fr]:
        'Si une forme est cachée, peut-on la reconstruire en demandant seulement quel point de son contour est le plus proche d’un point choisi\u202F? La question vient des explications contrefactuelles en IA\u202F: en en demandant assez, on peut retrouver toute la frontière de décision d’un modèle. Je conçois des algorithmes de requêtes qui retrouvent un polygone inconnu, du cas convexe jusqu’aux formes non convexes dont le contour est difficile à atteindre, et j’étudie quand une reconstruction exacte est possible et combien de requêtes elle demande.',
    },
    period: {
      [Locale.En]: 'Fall 2026 → Winter 2027 · in progress',
      [Locale.Fr]: 'Automne 2026 → hiver 2027 · en cours',
    },
    context: {
      [Locale.En]: 'UPIR research scholarship · supervised by Prof. Thibaut Vidal',
      [Locale.Fr]: 'Bourse de recherche UPIR · sous la supervision du professeur Thibaut Vidal',
    },
  },
  {
    id: ProjectId.IsingMachine,
    title: {
      [Locale.En]: 'Ising machine on GPU',
      [Locale.Fr]: 'Machine d’Ising sur GPU',
    },
    summary: {
      [Locale.En]:
        'An Ising machine solves a hard combinatorial problem by recasting it as a network of interacting spins and searching for the configuration with the lowest energy. Existing work runs it on FPGAs. I am implementing it on GPUs and applying it to a practical problem, with the management of distributed energy resources in power grids as a first candidate.',
      [Locale.Fr]:
        'Une machine d’Ising résout un problème combinatoire difficile en le reformulant comme un réseau de spins en interaction, puis en cherchant la configuration d’énergie minimale. Les travaux existants l’exécutent sur FPGA. Je l’implémente sur GPU et je l’applique à un problème concret, la gestion des ressources énergétiques distribuées dans les réseaux électriques étant une première piste.',
    },
    period: {
      [Locale.En]: 'Fall 2026 · in progress',
      [Locale.Fr]: 'Automne 2026 · en cours',
    },
    context: {
      [Locale.En]: 'Research project (INF8901) · supervised by Prof. Tarek Ould-Bachir',
      [Locale.Fr]:
        'Projet de recherche (INF8901) · sous la supervision du professeur Tarek Ould-Bachir',
    },
  },
  {
    id: ProjectId.Lyra,
    title: {
      [Locale.En]: 'Lyra, a Hex-playing agent',
      [Locale.Fr]: 'Lyra, un agent qui joue au Hex',
    },
    summary: {
      [Locale.En]:
        'An agent that plays Hex on a 14×14 board, built for the Abyss competition. It searches with Monte Carlo Tree Search and RAVE, guided by pattern-based priors and playouts. It prunes moves that can be proven useless (inferior cell elimination) and looks for virtual connections: links between stones that the opponent can no longer cut.',
      [Locale.Fr]:
        'Un agent qui joue au Hex sur un plateau 14×14, conçu pour la compétition Abyss. Il cherche avec Monte Carlo Tree Search et RAVE, orienté par des motifs de jeu connus, dans l’arbre comme dans les simulations. Il élague les coups dont on peut prouver l’inutilité (élimination des cases inférieures) et repère les connexions virtuelles\u202F: des liens entre pierres que l’adversaire ne peut plus couper.',
    },
    period: {
      [Locale.En]: 'Fall 2025',
      [Locale.Fr]: 'Automne 2025',
    },
    context: {
      [Locale.En]: 'Course project (INF8175) · with Mathis Ors',
      [Locale.Fr]: 'Projet de cours (INF8175) · avec Mathis Ors',
    },
  },
];
