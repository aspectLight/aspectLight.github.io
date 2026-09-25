import { Locale } from '@core/enums/locale.enum';
import type { ProjectEntry } from '@core/types/project.types';

/** Newest first. Repositories are private, so no source links yet. */
export const PROJECTS: readonly ProjectEntry[] = [
  {
    title: {
      [Locale.En]: 'Research internship in trustworthy machine learning',
      [Locale.Fr]: 'Stage de recherche en apprentissage automatique digne de confiance',
    },
    summary: {
      [Locale.En]:
        'A two-term undergraduate research internship in Prof. Thibaut Vidal’s group, which studies trustworthy machine learning through combinatorial optimization: using exact optimization to audit, explain and attack models. One of the group’s results shows that a trained random forest can give away the dataset it was trained on.',
      [Locale.Fr]:
        'Un stage de recherche de premier cycle sur deux trimestres dans le groupe du professeur Thibaut Vidal, qui étudie l’apprentissage automatique digne de confiance sous l’angle de l’optimisation combinatoire : se servir de l’optimisation exacte pour auditer, expliquer et attaquer des modèles. L’un des résultats du groupe montre qu’une forêt aléatoire entraînée peut révéler les données qui ont servi à l’entraîner.',
    },
    period: {
      [Locale.En]: 'Fall 2026 → Winter 2027 · in progress',
      [Locale.Fr]: 'Automne 2026 → hiver 2027 · en cours',
    },
    context: {
      [Locale.En]:
        'UPIR research scholarship, Polytechnique Montréal · supervised by Prof. Thibaut Vidal',
      [Locale.Fr]:
        'Bourse de recherche UPIR, Polytechnique Montréal · sous la supervision du professeur Thibaut Vidal',
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
