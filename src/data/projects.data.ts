import { Locale } from '@core/enums/locale.enum';
import type { ProjectEntry } from '@core/types/project.types';

/** Newest first. Repositories are private, so no source links yet. */
export const PROJECTS: readonly ProjectEntry[] = [
  {
    title: {
      [Locale.En]: 'Reconstructing a hidden polygon from proximity queries',
      [Locale.Fr]: 'Reconstruire un polygone caché à partir de requêtes de proximité',
    },
    summary: {
      [Locale.En]:
        'If a shape is hidden, can you rebuild it only by asking which point of its boundary is closest to a point you choose? The question comes from counterfactual explanations in AI: each one gives the smallest change that flips a model’s decision, so enough of them may give away the model’s whole decision boundary. I design algorithms that recover the vertices and edges of an unknown polygon with as few queries as possible, starting from the convex case and focusing on non-convex polygons, whose boundary has parts that are hard to reach. The work covers when exact reconstruction is possible, proofs of correctness and query counts, hard instances, and experiments comparing Euclidean and L1 distance.',
      [Locale.Fr]:
        'Si une forme est cachée, peut-on la reconstruire en demandant seulement quel point de son contour est le plus proche d’un point choisi ? La question vient des explications contrefactuelles en IA : chacune donne la plus petite modification qui change la décision d’un modèle, si bien qu’en en demandant assez, on peut retrouver toute sa frontière de décision. Je conçois des algorithmes qui retrouvent les sommets et les arêtes d’un polygone inconnu avec le moins de requêtes possible, en partant du cas convexe pour aller vers les polygones non convexes, dont certaines parties du contour sont difficiles à atteindre. Le travail porte sur les conditions d’une reconstruction exacte, la preuve de correction et le nombre de requêtes, des cas difficiles, et des expériences comparant les distances euclidienne et L1.',
    },
    period: {
      [Locale.En]: 'Fall 2026 → Winter 2027 · in progress',
      [Locale.Fr]: 'Automne 2026 → hiver 2027 · en cours',
    },
    context: {
      [Locale.En]:
        'UPIR research scholarship, Polytechnique Montréal · supervised by Prof. Thibaut Vidal, Trustworthy Machine Learning',
      [Locale.Fr]:
        'Bourse de recherche UPIR, Polytechnique Montréal · sous la supervision du professeur Thibaut Vidal, Trustworthy Machine Learning',
    },
  },
  {
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
      [Locale.En]:
        'Research project (INF8901), Polytechnique Montréal · supervised by Prof. Tarek Ould-Bachir',
      [Locale.Fr]:
        'Projet de recherche (INF8901), Polytechnique Montréal · sous la supervision du professeur Tarek Ould-Bachir',
    },
  },
  {
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
      [Locale.En]: 'Course project (INF8175), Polytechnique Montréal · with Mathis Ors',
      [Locale.Fr]: 'Projet de cours (INF8175), Polytechnique Montréal · avec Mathis Ors',
    },
  },
];
