import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Typography,
  useTheme,
  styled
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

// Styled components
const CalendarGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius
}));

const DayCell = styled(Box)(({ theme, isToday, isSelected, isOtherMonth }) => ({
  position: 'relative',
  aspectRatio: '1',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  backgroundColor: isSelected
    ? theme.palette.primary.main
    : isToday
    ? theme.palette.primary.lighter
    : 'transparent',
  color: isSelected
    ? theme.palette.primary.contrastText
    : isOtherMonth
    ? theme.palette.text.disabled
    : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: isSelected
      ? theme.palette.primary.dark
      : theme.palette.action.hover
  }
}));

const EventDot = styled(Box)(({ theme, color }) => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  backgroundColor: color || theme.palette.primary.main,
  margin: '2px'
}));

const Calendar = ({
  date = new Date(),
  events = [],
  onDateSelect,
  onEventClick,
  onMonthChange,
  minDate,
  maxDate,
  loading = false,
  error = false,
  sx = {}
}) => {
  const theme = useTheme();
  const [selectedDate, setSelectedDate] = React.useState(date);
  const [currentMonth, setCurrentMonth] = React.useState(date);

  // Get calendar days
  const getDays = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start, end });
  };

  // Get events for a specific day
  const getDayEvents = (day) => {
    return events.filter(event =>
      isSameDay(new Date(event.date), day)
    );
  };

  // Handle day click
  const handleDayClick = (day) => {
    setSelectedDate(day);
    onDateSelect?.(day);
  };

  // Handle month navigation
  const handlePreviousMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    if (!minDate || newMonth >= minDate) {
      setCurrentMonth(newMonth);
      onMonthChange?.(newMonth);
    }
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    if (!maxDate || newMonth <= maxDate) {
      setCurrentMonth(newMonth);
      onMonthChange?.(newMonth);
    }
  };

  // Week day headers
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card sx={sx}>
      {/* Calendar Header */}
      <CardHeader
        title={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              {format(currentMonth, 'MMMM yyyy')}
            </Typography>
            <Box>
              <IconButton
                onClick={handlePreviousMonth}
                disabled={minDate && currentMonth <= minDate}
              >
                <ChevronLeftIcon />
              </IconButton>
              <IconButton
                onClick={handleNextMonth}
                disabled={maxDate && currentMonth >= maxDate}
              >
                <ChevronRightIcon />
              </IconButton>
            </Box>
          </Box>
        }
      />

      <CardContent>
        {/* Week Days */}
        <CalendarGrid>
          {weekDays.map(day => (
            <Box
              key={day}
              sx={{
                textAlign: 'center',
                color: theme.palette.text.secondary,
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              {day}
            </Box>
          ))}
        </CalendarGrid>

        {/* Calendar Days */}
        <CalendarGrid>
          {getDays().map(day => {
            const dayEvents = getDayEvents(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = isSameDay(day, selectedDate);
            const isOtherMonth = !isSameMonth(day, currentMonth);

            return (
              <DayCell
                key={day.toString()}
                isToday={isToday}
                isSelected={isSelected}
                isOtherMonth={isOtherMonth}
                onClick={() => handleDayClick(day)}
              >
                <Typography variant="body2">
                  {format(day, 'd')}
                </Typography>
                {dayEvents.length > 0 && (
                  <Box
                    sx={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      mt: 0.5
                    }}
                  >
                    {dayEvents.slice(0, 3).map((event, index) => (
                      <EventDot
                        key={index}
                        color={event.color}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: '0.75rem',
                          color: isSelected
                            ? theme.palette.primary.contrastText
                            : theme.palette.text.secondary
                        }}
                      >
                        +{dayEvents.length - 3}
                      </Typography>
                    )}
                  </Box>
                )}
              </DayCell>
            );
          })}
        </CalendarGrid>
      </CardContent>
    </Card>
  );
};

// Preset configurations for common use cases
export const SkillCalendar = ({ skills = [], ...props }) => {
  const events = skills.map(skill => ({
    date: skill.startDate,
    color: skill.type === 'daySkill'
      ? theme.palette.primary.main
      : theme.palette.secondary.main,
    ...skill
  }));

  return (
    <Calendar
      events={events}
      {...props}
    />
  );
};

export const AssessmentCalendar = ({ assessments = [], ...props }) => {
  const events = assessments.map(assessment => ({
    date: assessment.date,
    color: assessment.status === 'upcoming'
      ? theme.palette.warning.main
      : theme.palette.success.main,
    ...assessment
  }));

  return (
    <Calendar
      events={events}
      {...props}
    />
  );
};

// Usage example:
/*
const MyComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const events = [
    {
      id: 1,
      date: new Date(),
      title: 'Event 1',
      color: theme.palette.primary.main
    },
    {
      id: 2,
      date: new Date(),
      title: 'Event 2',
      color: theme.palette.secondary.main
    }
  ];

  return (
    <Calendar
      date={selectedDate}
      events={events}
      onDateSelect={setSelectedDate}
      onEventClick={(event) => console.log('Event clicked:', event)}
    />
  );
};

// Using preset configurations
const MyComponent = () => {
  const skills = [
    {
      id: 1,
      title: 'React Basics',
      startDate: new Date(),
      type: 'daySkill'
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      startDate: new Date(),
      type: 'nightSkill'
    }
  ];

  return (
    <SkillCalendar
      skills={skills}
      onEventClick={(skill) => console.log('Skill clicked:', skill)}
    />
  );
};
*/

export default Calendar;
