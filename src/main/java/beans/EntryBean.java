package beans;

import org.hibernate.annotations.GeneratorType;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
public class EntryBean implements Serializable {

    @Id
    @SequenceGenerator(name = "entrySequence", sequenceName = "ENTRY_SEQUENCE", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "entrySequence")
    private int id;
    private double x;
    private double y;
    private double r;
    private String currentTime;
    private boolean isHit;

    public EntryBean() {
        this.x = 0;
        this.y = 0;
        this.r = 0;
        this.isHit = false;
    }

    public EntryBean(double x, double y, double r, boolean isHit) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
    }

    public double getR() {
        return r;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public boolean isHit() {
        return isHit;
    }

    private boolean rectangle() {
        return x>=-r && x<=0 && y>=-r/2 && y<=0;
    }

    private boolean triangle() {
        return x>=0 && y<=0 && y>=x/2 - r/2;
    }

    private boolean circle() {
        return x<=0 && y>=0 && (x*x + y*y <= r*r/4);
    }

    public void checkIfHit() {
        isHit = rectangle() || triangle() || circle();
    }

    public void setHit(boolean hit) {
        isHit = hit;
    }

    public void setR(double r) {
        this.r = r;
    }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    @Override
    public String toString() {
        return "EntryBean{" +
                "x=" + x +
                ", y=" + y +
                ", r=" + r +
                ", currentTime=" + currentTime +
                ", isHit=" + isHit +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EntryBean)) return false;
        EntryBean entryBean = (EntryBean) o;
        return Double.compare(entryBean.getX(), getX()) == 0 &&
                Double.compare(entryBean.getY(), getY()) == 0 &&
                Double.compare(entryBean.getR(), getR()) == 0 &&
                isHit() == entryBean.isHit();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getX(), getY(), getR(), isHit());
    }
}
