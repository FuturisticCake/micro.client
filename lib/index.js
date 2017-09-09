function findNearest(bot, entityTypes) {
	var closest, lowestDistance
	const entities = Object.values(bot.entities)
	for (let i = 0; i < entities.length; i++) {
		const entity = entities[i]
		if (entity !== bot.entity) {
			if (entityTypes.indexOf(entity.type) !== -1) {
				const dist = bot.entity.position.distanceTo(entity.position)
				if (!closest || dist < lowestDistance) {
					closest = entity
					lowestDistance = dist
				}
			}
		}
	}
	return closest
}

function killAuraInterval(entityTypes) {
	const target = findNearest(this, this.ka.entityTypes)
	if (target) {
		if (this.ka.follow) {
			this.lookAt(target.position.offset(0, target.height, 0))
		} else if (this.ka.teleport) {
			this.entity.position = target.position
		}
		this.attack(target)
	}
}

function inject(bot) {
	bot.ka = { }
	bot.enableKillAura = function(entityTypes, follow, teleport) {
		this.ka.entityTypes = entityTypes
		if (follow) {
			this.setControlState('sprint', true)
			this.setControlState('jump', true)
			this.setControlState('forward', true)
		}
		this.ka.follow = follow
		this.ka.teleport = teleport
		this.ka.interval = setInterval(killAuraInterval.bind(this), 650)
	}
	bot.disableKillAura = function() {
		clearInterval(this.ka.interval)
	}
}

module.exports = inject