import React, { ReactElement } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";

const TODAY_ARROW_COLOR = "#fea362";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  weekendColor: string;
  rtl: boolean;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  weekendColor,
  rtl,
}) => {
  let y = 0;
  const gridRows: ReactElement[] = [];
  const rowLines: ReactElement[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactElement[] = [];
  const weekends: ReactElement[] = [];
  let today: ReactElement = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );

    if (weekendColor !== "transparent" && [0, 6].includes(date.getDay())) {
      weekends.push(
        <rect
          key={"WeekendColumn" + date.getTime()}
          x={tickX}
          y={0}
          width={columnWidth}
          height={y}
          fill={weekendColor}
        />
      );
    }
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <svg>
          {/* 사각형 (배경) */}
          <rect
            x={tickX}
            y={0}
            width={columnWidth}
            height={y}
            fill={todayColor}
          />

          {/* 중앙 세로선 */}
          <rect
            x={tickX + columnWidth / 2 - 0.5}
            y={5}
            width={1}
            height={y - 5}
            style={{
              fill: TODAY_ARROW_COLOR,
              stroke: TODAY_ARROW_COLOR,
              strokeWidth: 1,
            }}
          />

          {/* 세로로 긴 역삼각형 화살표 머리 */}
          <polygon
            points={`${tickX + columnWidth / 2 - 5},0  ${
              tickX + columnWidth / 2 + 5
            },0  ${tickX + columnWidth / 2},5    `}
            style={{
              fill: TODAY_ARROW_COLOR,
              stroke: TODAY_ARROW_COLOR,
              strokeWidth: 1,
            }}
          />
        </svg>
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={y}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="weekends">{weekends}</g>
      <g className="today">{today}</g>
    </g>
  );
};
