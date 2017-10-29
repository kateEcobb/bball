
/*TOTAL GAME POINTS*/
select 
--*,
--player.id playerid,
player.team_id,
play.game_id
--,
--player.first_name,
--player.last_name
,
sum(play.points) totalpoints 
from play_info play
left outer join player_info player
on
play.player_id = player.id
where
player.id is not null
--AND
--play.game_id = 1
group by
play.game_id,
player.team_id
--,
--player.id
order by play.game_id;

/*TOTAL PLAYER POINTS BY GAME*/
select *,
(cast(finals.totalplayerpoints as float)/cast(finals.totalpoints as float)) * 10 rating
from(
	select 
	player.id playerid,
	player.team_id,
	play.game_id
	,
	player.first_name,
	player.last_name
	,
	sum(play.points) totalplayerpoints ,
	total.totalpoints
	from play_info play
	left outer join player_info player
	on
	play.player_id = player.id
	left outer join
		(select 
		player.team_id team,
		play.game_id game
		,
		sum(play.points) totalpoints 
		from play_info play
		left outer join player_info player
		on
		play.player_id = player.id
		where
		player.id is not null
		group by
		play.game_id,
		player.team_id
		order by play.game_id
		)total
	on
	play.game_id = total.game
	and
	player.team_id = total.team
	where
	player.id is not null
	AND
	play.game_id = 1
	group by
	player.id,
	play.game_id,
	total.totalpoints,
	
	player.team_id) finals

