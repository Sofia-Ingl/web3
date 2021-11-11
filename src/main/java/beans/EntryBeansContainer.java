package beans;

import javax.annotation.PreDestroy;
import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class EntryBeansContainer implements Serializable {

    private final DateTimeFormatter formatter;

    private List<EntryBean> entryBeansContainer;
    private EntryBean currentEntry;

    private EntityManagerFactory entityManagerFactory;
    private EntityManager entityManager;
    private EntityTransaction transaction;


    public EntryBeansContainer() {
        System.out.println("Created!");
        formatter = DateTimeFormatter.ofPattern("yyyy/MM/dd hh:mm:ss");
        entryBeansContainer = new ArrayList<>();
        establishConnectionWithDB();
        loadAllEntries();
        currentEntry = new EntryBean();
    }

    synchronized private void establishConnectionWithDB() {
        entityManagerFactory = Persistence.createEntityManagerFactory("persist");
        entityManager = entityManagerFactory.createEntityManager();
        transaction = entityManager.getTransaction();
        System.out.println("connected");
    }

    synchronized private void loadAllEntries() {
        try {
            transaction.begin();
            Query query = entityManager.createQuery("SELECT e FROM EntryBean e");
            entryBeansContainer = query.getResultList();
            transaction.commit();
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw e;
        }
    }

    synchronized public void addEntry() {
        try {
            transaction.begin();
            System.out.println("Add");
            currentEntry.checkIfHit();
            LocalDateTime localDateTime = LocalDateTime.now();
            String time = localDateTime.format(formatter);
            currentEntry.setCurrentTime(time);
            entryBeansContainer.add(currentEntry);
            System.out.println(currentEntry);
            entityManager.persist(currentEntry);
            transaction.commit();
            currentEntry = new EntryBean();
        } catch (Exception e) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw e;
        }
    }

    synchronized public void clearEntries() {
        try {
            transaction.begin();
            Query query = entityManager.createQuery("DELETE FROM EntryBean");
            query.executeUpdate();
            System.out.println("Clear");
            entryBeansContainer.clear();
            transaction.commit();
        } catch (RuntimeException exception) {
            if (transaction.isActive()) {
                transaction.rollback();
            }
            throw exception;
        }
    }

    public EntryBean getCurrentEntry() {
        return currentEntry;
    }


    public List<EntryBean> getEntryBeansContainer() {
        return entryBeansContainer;
    }

    @PreDestroy
    public void close() {
        if (entityManager.isOpen()) entityManager.close();
        if (entityManagerFactory.isOpen()) entityManagerFactory.close();
    }

}
