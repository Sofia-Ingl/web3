package beans;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.Query;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class EntryBeansContainer implements Serializable {

    private List<EntryBean> entryBeansContainer;

    private EntityManager entityManager;
    private EntityTransaction transaction;


    public EntryBeansContainer() {
        System.out.println("Created!");
        entryBeansContainer = new ArrayList<>();
        //establishConnectionWithDB();
        //loadAllEntries();
        entryBeansContainer.add(new EntryBean());
        //currentEntry = new EntryBean();
    }

    private void establishConnectionWithDB() {
        entityManager = Persistence.createEntityManagerFactory("persist").createEntityManager();
        transaction = entityManager.getTransaction();
    }

    private void loadAllEntries() {
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

    public void addEntry() {
//        try {
//            transaction.begin();
            EntryBean currentEntry = entryBeansContainer.get(entryBeansContainer.size() - 1);
            currentEntry.checkIfHit();
            entryBeansContainer.add(new EntryBean());
//            entityManager.persist(currentEntry);
        System.out.println("LIST:");
            for (EntryBean eb:
                 entryBeansContainer) {
                System.out.println(eb);
            }
//            transaction.commit();
//        } catch (Exception e) {
//            if (transaction.isActive()) {
//                transaction.rollback();
//            }
//            throw e;
//        }
    }

    public void clearEntries() {
//        try {
//            transaction.begin();
//            Query query = entityManager.createQuery("DELETE FROM EntryBean");
//            query.executeUpdate();
            entryBeansContainer.clear();
//            transaction.commit();
//        } catch (RuntimeException exception) {
//            if (transaction.isActive()) {
//                transaction.rollback();
//            }
//            throw exception;
//        }
    }

    public EntryBean getCurrentEntry() {
        return entryBeansContainer.get(entryBeansContainer.size() - 1);
    }


//    public EntryBeansContainer(List<EntryBean> entryBeans) {
//        this.entryBeansContainer = entryBeans;
//    }

    public List<EntryBean> getEntryBeansContainer() {
        return entryBeansContainer;
    }

//    public void setEntryBeansContainer(List<EntryBean> entryBeansContainer) {
//        this.entryBeansContainer = entryBeansContainer;
//    }

}
