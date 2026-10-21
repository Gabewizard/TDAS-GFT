import { Vec2 } from 'cc';

export interface IntentConfig {
    seekWeight: number;
    fleeWeight: number;
    maxSpeed: number;
    maxPredictionTime: number;
    spotPlayerDistance: number;
    lostPlayerDistance: number;
}

export interface WhiskerConfig {
    startPos: Vec2;
    angle: number;
    length: number;
}

export interface FlockingWeights {
    separationWeight: number;
    separationRadius: number;
    alignmentWeight: number;
    alignmentRadius: number;
    cohesionWeight: number;
    cohesionRadius: number;
}

export interface MovementConfig {
    maxTurnForce: number;
    avoidWeight: number;
    whiskers: WhiskerConfig[];
    flocking: FlockingWeights;
}

export interface EnemyConfig {
    scale: Vec2;
    health: number;
    intent: IntentConfig;
    moving: MovementConfig;
}

// Preserve the existing prefab settings while its factory is being built.
export function createDefaultEnemyConfig(): EnemyConfig {
    return {
        scale: new Vec2(1, 1),
        health: 20,
        intent: {
            seekWeight: 1, fleeWeight: 0, maxSpeed: 4, maxPredictionTime: 2,
            spotPlayerDistance: 200, lostPlayerDistance: 250,
        },
        moving: {
            maxTurnForce: 0.2,
            avoidWeight: 3,
            flocking: {
                separationWeight: 3, separationRadius: 100,
                alignmentWeight: 0, alignmentRadius: 0,
                cohesionWeight: 5, cohesionRadius: 0,
            },
            whiskers: [
                { startPos: new Vec2(), angle: 0, length: 100 },
                { startPos: new Vec2(), angle: 25, length: 75 },
                { startPos: new Vec2(), angle: -25, length: 75 },
                { startPos: new Vec2(), angle: 45, length: 50 },
                { startPos: new Vec2(), angle: -45, length: 50 },
            ],
        },
    };
}

