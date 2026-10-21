import { _decorator, CCFloat, Component, director, Vec2 } from 'cc';
import { Enemy } from './Enemy';
import type { EnemyConfig, WhiskerConfig } from './EnemyConfig';

const { ccclass, property } = _decorator;

@ccclass('WhiskerConfigEditor')
export class WhiskerConfigEditor implements WhiskerConfig {
    @property({ type: Vec2 })
    public startPos: Vec2 = new Vec2();

    @property({ type: CCFloat })
    public angle: number = 0;

    @property({ type: CCFloat })
    public length: number = 50;
}

function createWhisker(angle: number, length: number): WhiskerConfigEditor {
    const whisker = new WhiskerConfigEditor();
    whisker.angle = angle;
    whisker.length = length;
    return whisker;
}

@ccclass('EnemyConfigTool')
export class EnemyConfigTool extends Component {
    @property({ type: Vec2, group: 'Enemy Base' })
    public scale: Vec2 = new Vec2(1, 1);

    @property({ group: 'Enemy Base', slide: true, range: [1, 100, 1] })
    public health: number = 20;

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public seekWeight: number = 1;

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public fleeWeight: number = 0;

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public maxPredictionTime: number = 2;

    @property({ group: 'Intent Weights', slide: true, range: [0, 5, 0.1] })
    public maxSpeed: number = 4;

    @property({ group: 'Intent Weights', slide: true, range: [0, 500, 10] })
    public spotPlayerDistance: number = 200;

    @property({ group: 'Intent Weights', slide: true, range: [0, 500, 10] })
    public lostPlayerDistance: number = 250;

    @property({ group: 'Movement Weights', slide: true, range: [0, 1, 0.1] })
    public maxTurnForce: number = 0.2;

    @property({ group: 'Movement Weights', slide: true, range: [0, 10, 0.1] })
    public avoidWeight: number = 3;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public separationWeight: number = 1;

    @property({ group: 'Movement Weights', slide: true, range: [0, 150, 5] })
    public separationRadius: number = 50;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public alignmentWeight: number = 1;

    @property({ group: 'Movement Weights', slide: true, range: [0, 200, 5] })
    public alignmentRadius: number = 100;

    @property({ group: 'Movement Weights', slide: true, range: [0, 5, 0.1] })
    public cohesionWeight: number = 1;

    @property({ group: 'Movement Weights', slide: true, range: [0, 400, 5] })
    public cohesionRadius: number = 245;

    @property({ type: [WhiskerConfigEditor], group: 'Whiskers Config' })
    public whiskers: WhiskerConfigEditor[] = [
        createWhisker(0, 100),
        createWhisker(25, 75),
        createWhisker(-25, 75),
        createWhisker(45, 50),
        createWhisker(-45, 50),
    ];

    public enemyConfig: EnemyConfig | null = null;

    protected onLoad(): void {
        this.enemyConfig = {
            scale: this.scale.clone(),
            health: this.health,
            intent: {
                seekWeight: this.seekWeight,
                fleeWeight: this.fleeWeight,
                maxSpeed: this.maxSpeed,
                maxPredictionTime: this.maxPredictionTime,
                spotPlayerDistance: this.spotPlayerDistance,
                lostPlayerDistance: this.lostPlayerDistance,
            },
            moving: {
                maxTurnForce: this.maxTurnForce,
                avoidWeight: this.avoidWeight,
                flocking: {
                    separationWeight: this.separationWeight,
                    separationRadius: this.separationRadius,
                    alignmentWeight: this.alignmentWeight,
                    alignmentRadius: this.alignmentRadius,
                    cohesionWeight: this.cohesionWeight,
                    cohesionRadius: this.cohesionRadius,
                },
                whiskers: this.whiskers.map(whisker => ({
                    startPos: whisker.startPos.clone(),
                    angle: whisker.angle,
                    length: whisker.length,
                })),
            },
        };

        const scene = director.getScene();
        if (!scene) return;
        for (const enemy of scene.getComponentsInChildren(Enemy)) {
            enemy.init(this.enemyConfig);
        }
    }
}
