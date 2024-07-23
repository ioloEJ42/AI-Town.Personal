import { convexToJson, jsonToConvex, JSONValue, ObjectType, v } from 'convex/values';
import { GameId, agentId, parseGameId } from './ids';

export class AgentDescription {
  agentId: GameId<'agents'>;
  identity: string;
  plan: string;
  role: string;
  wanderRanges: JSON;

  constructor(serialized: SerializedAgentDescription) {
    const { agentId, identity, plan, role,wanderRanges } = serialized;
    this.agentId = parseGameId('agents', agentId);
    this.identity = identity;
    this.plan = plan;
    this.role = role;
    this.wanderRanges = wanderRanges;
  }

  serialize(): SerializedAgentDescription {
    const { agentId, identity, plan, role,wanderRanges} = this;
    return { agentId, identity, plan, role,wanderRanges };
  }
}

export const serializedAgentDescription = {
  agentId,
  identity: v.string(),
  plan: v.string(),
  role: v.string(),
  wanderRanges: v.any()
};
export type SerializedAgentDescription = ObjectType<typeof serializedAgentDescription>;
