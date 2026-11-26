import React from 'react';
import { formatDiff } from '../data';

const StandingsTable = ({ standings }) => {
  return (
    <section className="section">
      <h2>Bảng xếp hạng</h2>
      <table>
        <thead>
          <tr>
            <th>Hạng</th>
            <th className="text-left">Đội</th>
            <th>Trận</th>
            <th>Thắng</th>
            <th>Hòa</th>
            <th>Thua</th>
            <th>BT</th>
            <th>BB</th>
            <th>HS</th>
            <th>Điểm</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team, index) => {
            const isLast = index === standings.length - 1;
            return (
              <tr key={team.id} className={isLast ? 'last-place' : undefined}>
                <td>{index + 1}</td>
                <td className="text-left">{team.name}</td>
                <td>{team.played}</td>
                <td>{team.won}</td>
                <td>{team.drawn}</td>
                <td>{team.lost}</td>
                <td>{team.gf}</td>
                <td>{team.ga}</td>
                <td>{formatDiff(team.diff)}</td>
                <td>{team.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};

export default StandingsTable;